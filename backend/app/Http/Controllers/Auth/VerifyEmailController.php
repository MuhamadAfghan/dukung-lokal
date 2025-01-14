<?php

namespace App\Http\Controllers\Auth;

use App\Helpers\ApiFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return ApiFormatter::sendResponse('success', 200, 'Email already verified');
            // return redirect()->intended(
            //     config('app.frontend_url').'/dashboard?verified=1'
            // );
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return ApiFormatter::sendResponse('success', 200, 'Email verified successfully');

        // return redirect()->intended(
        //     config('app.frontend_url').'/dashboard?verified=1'
        // );
    }
}