<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Culture;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CultureController extends Controller
{
    public function index(Request $request)
    {
        $query = Culture::with(['province', 'category'])
            ->where('status', 'published');

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('desc', 'like', "%{$search}%");
            });
        }

        if ($provinceId = $request->query('province_id')) {
            $query->where('province_id', $provinceId);
        } elseif ($provinceIds = $request->query('province_ids')) {
            if (is_array($provinceIds) && $provinceIds !== []) {
                $query->whereIn('province_id', $provinceIds);
            }
        } elseif ($province = $request->query('province')) {
            $query->whereHas('province', fn ($q) => $q->where('slug', $province));
        }

        if ($categoryId = $request->query('category_id')) {
            $query->where('category_id', $categoryId);
        } elseif ($categoryIds = $request->query('category_ids')) {
            if (is_array($categoryIds) && $categoryIds !== []) {
                $query->whereIn('category_id', $categoryIds);
            }
        } elseif ($category = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        if ($request->has('featured')) {
            $query->where('featured', filter_var($request->query('featured'), FILTER_VALIDATE_BOOLEAN));
        }

        $perPage = $request->integer('per_page', 12);
        return response()->json($query->paginate($perPage));
    }

    public function show(string $slug)
    {
        $culture = Culture::with(['province', 'category'])
            ->where('status', 'published')
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Culture::with(['province', 'category'])
            ->where('status', 'published')
            ->where('id', '!=', $culture->id)
            ->where(function ($q) use ($culture) {
                $q->where('category_id', $culture->category_id)
                    ->orWhere('province_id', $culture->province_id);
            })
            ->limit(4)
            ->get();

        return response()->json([
            'data'    => $culture,
            'related' => $related,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $culture = Culture::findOrFail($id);

        if ($request->has('facts') && ! is_array($request->input('facts'))) {
            $request->merge(['facts' => []]);
        }

        $validated = $request->validate([
            'province_id'      => 'sometimes|exists:provinces,id',
            'category_id'      => 'sometimes|exists:categories,id',
            'title'            => 'sometimes|string|max:255',
            'image'            => 'sometimes|image|mimes:jpeg,png,jpg,webp|max:2048',
            'desc'             => 'sometimes|string',
            'featured'         => 'sometimes|boolean',
            'status'           => 'sometimes|in:published,draft,archived',
            'source'           => 'nullable|string',
            'history'          => 'nullable|string',
            'facts'            => 'sometimes|array',
            'facts.*'          => 'nullable|string',
            'deleted_gallery_images' => 'sometimes|array',
            'images_gallery'   => 'nullable|array',
            'images_gallery.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Upload gambar utama
        if ($request->hasFile('image')) {
            if ($culture->image && Str::startsWith($culture->image, '/storage/cultures/')) {
                $oldPath = str_replace('/storage/', '', $culture->image);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            $file = $request->file('image');
            $slug = Str::slug($request->input('title', $culture->title)) ?: 'culture';
            $filename = $slug . '-' . time() . '.' . $file->getClientOriginalExtension();
            $path = 'cultures/' . $filename;
            Storage::disk('public')->put($path, file_get_contents($file->getRealPath()));
            $validated['image'] = '/storage/' . $path;
        } elseif (! $request->has('image')) {
            unset($validated['image']);
        }

        // Tangkap data array galeri lama
        $currentImages = is_array($culture->images) ? $culture->images : [];

        // Hapus foto galeri lama yang dipilih
        if ($request->has('deleted_gallery_images')) {
            $deletedImages = (array) $request->input('deleted_gallery_images', []);
            foreach ($deletedImages as $imagePath) {
                $storagePath = ltrim(str_replace('/storage/', '', $imagePath), '/');
                if (Storage::disk('public')->exists($storagePath)) {
                    Storage::disk('public')->delete($storagePath);
                }
                $currentImages = array_values(array_filter($currentImages, fn ($img) => $img !== $imagePath));
            }
            $validated['images'] = $currentImages;
        }

        // Multi-upload galeri gambar baru & gabungkan dengan sisa gambar lama
        if ($request->hasFile('images_gallery')) {
            $newGalleryPaths = [];
            foreach ($request->file('images_gallery') as $galleryFile) {
                $slug = Str::slug($request->input('title', $culture->title)) ?: 'culture';
                $filename = $slug . '-gallery-' . time() . '-' . uniqid() . '.' . $galleryFile->getClientOriginalExtension();
                $path = 'cultures/' . $filename;
                Storage::disk('public')->put($path, file_get_contents($galleryFile->getRealPath()));
                $newGalleryPaths[] = '/storage/' . $path;
            }
            $currentImages = array_merge($currentImages, $newGalleryPaths);
            $validated['images'] = $currentImages;
        }
        unset($validated['images_gallery']);
        unset($validated['deleted_gallery_images']);

        // Facts array
        if (isset($validated['facts'])) {
            $validated['facts'] = is_array($validated['facts'])
                ? array_values(array_filter($validated['facts'], fn ($f) => $f !== null && trim((string) $f) !== ''))
                : [];
        }

        $validated['updated_by'] = auth()->id();

        $culture->update($validated);

        return response()->json([
            'message' => 'Budaya berhasil diperbarui.',
            'data'    => $culture->load(['province', 'category', 'creator', 'editor']),
        ]);
    }

    public function feature(Request $request, int $id)
    {
        $culture = Culture::findOrFail($id);

        $validated = $request->validate([
            'featured' => 'nullable|boolean',
        ]);

        $newFeatured = array_key_exists('featured', $validated)
            ? (bool) $validated['featured']
            : ! $culture->featured;

        $culture->update([
            'featured'   => $newFeatured,
            'updated_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => $newFeatured ? 'Budaya berhasil dijadikan unggulan (Hero).' : 'Budaya dicabut dari status unggulan (Hero).',
            'data'    => $culture->load(['province', 'category']),
        ]);
    }

    public function destroy(Request $request, int $id)
    {
        $culture = Culture::findOrFail($id);

        $validated = $request->validate([
            'deletion_reason' => 'required|string|min:5',
        ]);

        $culture->update([
            'deleted_by'      => auth()->id(),
            'deletion_reason' => $validated['deletion_reason'],
        ]);

        $culture->delete();

        return response()->json([
            'message' => 'Budaya berhasil dihapus (soft delete).',
            'data'    => $culture,
        ]);
    }
}
