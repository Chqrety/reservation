<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Auth\AuthenticationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([          
          // membuat alias untuk class middleware cek role
          'role' => App\Http\Middleware\RoleMiddleware::class,
        ]);

        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {

      $exceptions->render(function (AuthenticationException $e, Request $request) {
          if ($request->is('api/*')) {
              return response()->json([
                   'success' => false,
                    'message' => 'Unauthenticated',
                    'data' => null,
                    'errors' => ['auth' => 'Token is invalid or expired. Please login again.'],
              ], 401);
          }
      });
    })->create();
