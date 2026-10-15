<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CultureController;
use App\Http\Controllers\Api\ProposalController;
use App\Http\Controllers\Api\ProvinceController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/auth/google/redirect', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

Route::middleware('throttle:60,1')->group(function () {
    Route::get('/provinces', [ProvinceController::class, 'index']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/cultures', [CultureController::class, 'index']);
    Route::get('/cultures/{slug}', [CultureController::class, 'show']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::match(['put', 'patch'], '/me', [AuthController::class, 'updateProfile']);
    Route::get('/proposals/mine', [ProposalController::class, 'myProposals']);

    Route::middleware('throttle:5,1')->group(function () {
        Route::post('/proposals', [ProposalController::class, 'store']);
    });
});

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/proposals', [ProposalController::class, 'allProposals']);
    Route::post('/proposals/{id}/verify', [ProposalController::class, 'verify']);

    Route::match(['put', 'patch'], '/cultures/{id}', [CultureController::class, 'update']);

    Route::get('/provinces', [ProvinceController::class, 'index']);
    Route::post('/provinces', [ProvinceController::class, 'store']);
    Route::match(['put', 'patch'], '/provinces/{id}', [ProvinceController::class, 'update']);
    Route::delete('/provinces/{id}', [ProvinceController::class, 'destroy']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::match(['put', 'patch'], '/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
});
