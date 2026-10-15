<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Culture;
use App\Models\CultureProposal;
use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProposalController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'             => 'required|string|max:255',
            'province_name'     => 'required|string|max:255|exists:provinces,name',
            'category_name'     => 'required|string|max:255|exists:categories,name',
            'description'       => 'required|string',
            'source'            => 'nullable|string',
            'history'           => 'nullable|string',
            'facts'             => 'nullable|array',
            'copyright_consent' => 'nullable|boolean',
            'image_path'        => 'nullable|string',
            'images'            => 'nullable|array|max:5',
            'images.*'          => 'required|file|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($request->hasFile('images')) {
            $imagePaths = [];
            foreach ($request->file('images') as $file) {
                $imagePaths[] = Storage::disk('public')->putFile('proposals', $file);
            }
            $validated['images'] = $imagePaths;
            if (empty($validated['image_path']) && ! empty($imagePaths)) {
                $validated['image_path'] = $imagePaths[0];
            }
        }

        $validated['status'] = 'pending';

        $proposal = $request->user()->proposals()->create($validated);

        return response()->json([
            'message' => 'Usulan berhasil dikirim dan menunggu verifikasi.',
            'data'    => $proposal,
        ], 201);
    }

    public function myProposals(Request $request)
    {
        $proposals = $request->user()
            ->proposals()
            ->latest()
            ->paginate(10);

        return response()->json($proposals);
    }

    public function allProposals(Request $request)
    {
        $query = CultureProposal::with('user')->latest();

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return response()->json($query->paginate(15));
    }

    public function verify(Request $request, int $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_note' => 'required_if:status,rejected|nullable|string',
        ]);

        $proposal = CultureProposal::findOrFail($id);

        if ($proposal->status !== 'pending') {
            return response()->json([
                'message' => 'Hanya usulan berstatus menunggu yang dapat diverifikasi.',
            ], 403);
        }

        $proposal = DB::transaction(function () use ($id, $validated) {
            $proposal = CultureProposal::lockForUpdate()->findOrFail($id);

            if ($proposal->status !== 'pending') {
                abort(403, 'Hanya usulan berstatus menunggu yang dapat diverifikasi.');
            }

            if ($validated['status'] === 'approved') {
                $province = Province::where('name', $proposal->province_name)->first();
                $category = Category::where('name', $proposal->category_name)->first();

                if (! $province || ! $category) {
                    throw ValidationException::withMessages([
                        'proposal' => ['Provinsi atau kategori usulan tidak ditemukan.'],
                    ]);
                }

                $slug = Str::slug($proposal->title);
                $baseSlug = $slug;
                $suffix = 2;

                while (Culture::where('slug', $slug)->exists()) {
                    $slug = "{$baseSlug}-{$suffix}";
                    $suffix++;
                }

                Culture::create([
                    'province_id' => $province->id,
                    'category_id' => $category->id,
                    'title' => $proposal->title,
                    'slug' => $slug,
                    'image' => $proposal->image_path,
                    'images' => $proposal->images ?? ($proposal->image_path ? [$proposal->image_path] : null),
                    'desc' => $proposal->description,
                    'source' => $proposal->source,
                    'history' => $proposal->history,
                    'facts' => $proposal->facts,
                    'status' => 'published',
                    'created_by' => auth()->id(),
                    'updated_by' => auth()->id(),
                ]);
            }

            $proposal->reviewed_by = auth()->id();
            $proposal->reviewed_at = now();
            $proposal->update($validated);

            return $proposal;
        });

        return response()->json([
            'message' => "Usulan berhasil di-{$validated['status']}.",
            'data' => $proposal->load('user'),
        ]);
    }
}
