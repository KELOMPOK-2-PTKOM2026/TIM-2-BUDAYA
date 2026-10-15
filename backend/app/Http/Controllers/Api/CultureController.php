<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Culture;
use Illuminate\Http\Request;

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

        $provinceIds = $request->query('province_ids');
        if (is_array($provinceIds) && $provinceIds !== []) {
            $query->whereIn('province_id', $provinceIds);
        } elseif ($province = $request->query('province')) {
            $query->whereHas('province', fn ($query) => $query->where('slug', $province));
        }

        $categoryIds = $request->query('category_ids');
        if (is_array($categoryIds) && $categoryIds !== []) {
            $query->whereIn('category_id', $categoryIds);
        } elseif ($category = $request->query('category')) {
            $query->whereHas('category', fn ($query) => $query->where('slug', $category));
        }

        if ($request->query('featured')) {
            $query->where('featured', true);
        }

        $perPage = $request->query('per_page', 6);
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

        $validated = $request->validate([
            'province_id' => 'sometimes|exists:provinces,id',
            'category_id' => 'sometimes|exists:categories,id',
            'title'       => 'sometimes|string|max:255',
            'image'       => 'nullable|string',
            'desc'        => 'sometimes|string',
            'featured'    => 'sometimes|boolean',
            'status'      => 'sometimes|in:draft,published,archived',
            'source'      => 'nullable|string',
            'history'     => 'nullable|string',
            'facts'       => 'nullable|array',
            'images'      => 'nullable|array',
        ]);

        $validated['updated_by'] = auth()->id();

        $culture->update($validated);

        return response()->json([
            'message' => 'Budaya berhasil diperbarui.',
            'data'    => $culture->load(['province', 'category', 'creator', 'editor']),
        ]);
    }
}
