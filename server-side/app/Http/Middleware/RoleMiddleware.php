<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        // cek apakah user sudah login atau belum
        $user = auth()->guard('api')->user();
          if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
                'data' => null,
                'errors' => [
                    'auth' => 'Login first to access this resource'
                ]
            ], 401);
          }

        // take user 
        $user = auth()->guard('api')->user();

        // role check 
        if(!in_array($user->role, $roles)) {
          return response()->json([
            'success' => false,
            'message' => 'Forbidden',
            'data' => null,
            'errors' => [
              'auth' => 'You do not have permission to access this resource'
            ]
          ], 403);
        }
        return $next($request);
    }
}
