<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\ApiFormatter;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!auth()->attempt($request->only('email', 'password'), true)) {
            return response()->json([
                'status' => 'error',
                'status_code' => 401,
                'message' => 'Invalid credentials',
            ], 401);
        }
        $user = auth()->user();

        $token = $user->createToken('auth_token')->plainTextToken;

        return ApiFormatter::sendResponse('success', 200, 'User logged in successfully', [
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return ApiFormatter::sendResponse('success', 200, 'User logged out successfully');
    }
}
