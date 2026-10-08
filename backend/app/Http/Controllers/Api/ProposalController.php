<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CultureProposal;
use Illuminate\Http\Request;

class ProposalController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'         => 'required|string|max:255',
            'province_name' => 'required|string|max:255',
            'category_name' => 'required|string|max:255',
            'description'   => 'required|string',
            'image_path'    => 'nullable|string',
        ]);

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
            'status'     => 'required|in:approved,rejected',
            'admin_note' => 'nullable|string',
        ]);

        $proposal = CultureProposal::findOrFail($id);
        $proposal->update($validated);

        return response()->json([
            'message' => "Usulan berhasil di-{$validated['status']}.",
            'data'    => $proposal->load('user'),
        ]);
    }
}
