<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Culture;
use Illuminate\Http\Request;

class CultureController extends Controller
{
    public function index(Request $request)
    {
        $query = Culture::with(['province', 'category']);

        if ($search = $request->query('search')) {
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('desc', 'like', "%{$search}%");
        }

        if ($province = $request->query('province')) {
            $query->whereHas('province', fn($q) => $q->where('slug', $province));
        }

        if ($category = $request->query('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $category));
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
            ->where('slug', $slug)
            ->firstOrFail();

        $related = Culture::with(['province', 'category'])
            ->where('province_id', $culture->province_id)
            ->where('id', '!=', $culture->id)
            ->limit(4)
            ->get();

        return response()->json([
            'data'    => $culture,
            'related' => $related,
        ]);
    }
}
