<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FormController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\Admin\AdminController;


// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // Form routes
    Route::get('/forms', [FormController::class, 'index']);
    Route::get('/forms/{form}', [FormController::class, 'show']);
    Route::post('/forms/{form}/submit', [FormController::class, 'submit']);
    Route::get('/my-submissions', [FormController::class, 'userSubmissions']);

    // Payment routes
    Route::post('/submissions/{submission}/payment/razorpay/create', [PaymentController::class, 'createRazorpayOrder']);
    Route::post('/payments/razorpay/verify', [PaymentController::class, 'verifyRazorpayPayment']);
    Route::post('/submissions/{submission}/payment/stripe/process', [PaymentController::class, 'processStripePayment']);

    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/forms', [AdminController::class, 'forms']);
        Route::post('/forms', [AdminController::class, 'createForm']);
        Route::put('/forms/{form}', [AdminController::class, 'updateForm']);
        Route::delete('/forms/{form}', [AdminController::class, 'deleteForm']);
        Route::get('/forms/{form}/submissions', [AdminController::class, 'formSubmissions']);
    });
});

// Health check endpoint (Laravel 11 feature)
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'version' => app()->version()
    ]);
});
