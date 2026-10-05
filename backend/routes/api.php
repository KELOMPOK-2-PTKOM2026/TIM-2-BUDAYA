<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CultureController;
use App\Http\Controllers\Api\ProvinceController;
use App\Http\Controllers\Api\CategoryController;
use App\Models\Province;
use App\Models\Category;

Route::get('/provinces', function () {
    return response()->json(Province::all());
});

Route::get('/categories', function () {
    return response()->json(Category::all());
});

Route::get('/cultures', [CultureController::class, 'index']);
Route::get('/cultures/{slug}', [CultureController::class, 'show']);
