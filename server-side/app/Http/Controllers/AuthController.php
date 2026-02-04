<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    public function login(Request $request)
    {

        // cek parameter
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // cek user exist
        if (! $token = Auth::guard('api')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password',
                'data' => null,
                'errors' => ['auth' => 'Invalid credentials'],
            ], 401);
        }

        // take the user data
        $user = Auth::guard('api')->user();

        // return response to the front end
        return response()->json([
            'success' => true,
            'message' => 'Login successfully',
            'data' => [
                'user' => $user,
                'token' => $token,
                'type' => 'bearer',
                'expiration' => Auth::guard('api')->factory()->getTTL() * 60,
            ],
            'errors' => null,
        ], 200);
    }

    public function register(Request $request)
    {

        // cek parameter
        $credentials = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // create user
        $user = User::create([
            'name' => $credentials['name'],
            'email' => $credentials['email'],
            'password' => Hash::make($credentials['password']),
        ]);

        // generate token jwt -> kalau mau auto login setelah create akun
        // $token = Auth::guard('api')->login($user);

        // return response
        return response()->json([
            'success' => true,
            'message' => 'Register successfully',
            'data' => [
                'user' => $user,
                // 'token' => $token,
                // 'type' => 'bearer',
                // 'expiration' => auth()->guard('api')->factory()->getTTL() * 60,
            ],
            'errors' => null,
        ], 201);

    }

    public function logout(){
      $token = Auth::guard('api')->getToken();
      try {
        Auth::guard('api')->invalidate($token);
       
        return response()->json([
          'success' => true,
          'message' => 'Logout successfully',
          'data' => null,
          'errors' => null,
        ], 200);     
      }catch(\Exception $e){
        return response()->json([
          'success' => false,
          'message' => 'Logout failed',
          'data' => null,
          'errors' => ['logout' => $e->getMessage()],
        ], 500); 
      }
    }

}
