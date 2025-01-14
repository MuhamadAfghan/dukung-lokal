<?php

use App\Helpers\ApiFormatter;
use App\Http\Controllers\GeocodeController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReportProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VendorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

require __DIR__ . '/auth.php';

Route::resource('positions', PositionController::class)->except(['create', 'edit']);

// ranking
Route::get('/users/ranking', [UserController::class, 'ranking']);
Route::get('/geocode', [GeocodeController::class, 'getGeocode']);
// Route::get('/geocode', function () {
//     $lat = request('lat');
//     $lng = request('long');
//     if (!$lat || !$lng) {
//         return response()->json([
//             'message' => 'Parameter lat dan lng harus diisi',
//         ], 400);
//     }

//     $apiKey = env('OPENCAGE_API_KEY', '03c48dae07364cabb7f121d8c1519492');

//     $response = Http::get("https://api.opencagedata.com/geocode/v1/json", [
//         'q' => "$lat+$lng",
//         'key' => $apiKey,
//         'no_annotations' => 1,
//         'language' => 'id',
//     ]);

//     return response()->json($response->json(), $response->status());
// });


Route::resource('products', ProductController::class)->except(['create', 'edit', 'store']);
// action like
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::resource('vendors', VendorController::class)->except(['create', 'edit']);
    Route::get('/users/my/umkm', [UserController::class, 'myUMKM']);
    Route::get('/users/my/profile', [UserController::class, 'myProfile']);
    Route::post('/users/my/medsos', [UserController::class, 'storeMedsos']);
    Route::get('/users/me', function (Request $request) {
        $query = $request->user()->load('reportProducts:id,user_id');
        return ApiFormatter::sendResponse('success', 200, 'User data', $query);
    });

    //change password
    Route::post('/users/change-password', [UserController::class, 'changePassword']);
    Route::put('/products/{id}/toggle-like', [ProductController::class, 'toggleLike']);
    Route::post('/products/{id}/report', [ReportProductController::class, 'store']);
});
