<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CultureController;
use App\Http\Controllers\Api\ProposalController;
use App\Models\Province;
use App\Models\Category;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::get('/provinces', function () {
    return response()->json(Province::all());
});

Route::get('/categories', function () {
    return response()->json(Category::all());
});

Route::get('/cultures', [CultureController::class, 'index']);
Route::get('/cultures/{slug}', [CultureController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/proposals', [ProposalController::class, 'store']);
    Route::get('/proposals/mine', [ProposalController::class, 'myProposals']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/proposals', [ProposalController::class, 'allProposals']);
    Route::post('/proposals/{id}/verify', [ProposalController::class, 'verify']);
});
