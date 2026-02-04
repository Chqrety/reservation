<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // get all users 
    public function index(Request $request){

      // pagination 
      $perPage = $request->input('per_page', 10);
      $perPage = min($perPage, 15);
      $users = User::paginate($perPage);

      return response()->json([
        'success' => true,
        'message' => 'Users retrieved successfully',
        'data' => UserResource::collection($users->items()),
        'pagination' => [
          'total' => $users->total(),
          'per_page' => $users->perPage(),
          'current_page' => $users->currentPage(),
          'last_page' => $users->lastPage(),          
        ],
        'errors' => null
      ], 200);
    }
}
