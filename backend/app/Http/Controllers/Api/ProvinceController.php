<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Province;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProvinceController extends Controller
{
    public function index()
    {
        return response()->json(Province::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255|unique:provinces,name',
            'slug'  => 'nullable|string|max:255|unique:provinces,slug',
            'image' => 'nullable|string|max:255',
            'tag'   => 'nullable|string|max:255',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $province = Province::create($validated);

        return response()->json([
            'message' => 'Provinsi berhasil ditambahkan.',
            'data'    => $province,
        ], 201);
    }

    public function update(Request $request, int $id)
    {
        $province = Province::findOrFail($id);

        $validated = $request->validate([
            'name'  => ['sometimes', 'required', 'string', 'max:255', Rule::unique('provinces', 'name')->ignore($province->id)],
            'slug'  => ['sometimes', 'required', 'string', 'max:255', Rule::unique('provinces', 'slug')->ignore($province->id)],
            'image' => ['nullable', 'string', 'max:255'],
            'tag'   => ['nullable', 'string', 'max:255'],
        ]);

        if (isset($validated['name']) && empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $province->update($validated);

        return response()->json([
            'message' => 'Provinsi berhasil diperbarui.',
            'data'    => $province,
        ]);
    }

    public function destroy(int $id)
    {
        $province = Province::findOrFail($id);

        if ($province->cultures()->exists()) {
            return response()->json([
                'message' => 'Provinsi tidak dapat dihapus karena masih memiliki data budaya terkait.',
            ], 409);
        }

        $province->delete();

        return response()->json([
            'message' => 'Provinsi berhasil dihapus.',
        ]);
    }
}
