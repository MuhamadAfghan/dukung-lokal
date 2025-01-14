<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\ApiFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return ApiFormatter::sendResponse('success', 200, 'Email already verified');
        }

        $request->user()->sendEmailVerificationNotification();

        return ApiFormatter::sendResponse('success', 200, 'Email verification link sent', [
            'email' => $request->user()->email,
        ]);
    }
}