<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            // if ($e->guards() != 'user') {
            return response()->json([
                'status' => 'error',
                'status_code' => '401',
                'message' => 'Invalid or expired token',
            ], 401);
            // }
        });

        $exceptions->render(function (NotFoundHttpException $e) {
            return response()->json([
                'status' => 'error',
                'status_code' => '404',
                'message' => 'Resource not found',
            ], 404);
        });

        $exceptions->render(function (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'status_code' => 400,
                'message' => 'Invalid field(s) in request',
                'errors' => $e->errors(),
            ], 400);
        });

        // Handle all other exceptions
        $exceptions->render(function (\Exception $e) {
            $response = [
                'status' => 'error',
                'status_code' => 500,
                'message' => 'An unexpected error occurred',
            ];

            if (env('APP_ENV') != 'prod') {
                $response['error'] = $e->getMessage();
            }

            return response()->json($response, 500);
        });
    })->create();
