<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\LocationCategoryController;
use App\Http\Controllers\ReservationController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


// auth
Route::prefix('/auth')->group(function () {
  Route::post('/login', [AuthController::class, 'login']);
  Route::post('/register', [AuthController::class, 'register']);
});


// public api routes for locations
Route::prefix('location')->group(function () {
    Route::get('/', [LocationController::class, 'index']);          // get all locations
    Route::get('/{id}', [LocationController::class, 'show']);       // get location by id
    Route::get('/filter/check', [LocationController::class, 'filler']); //  get filtered location 
});

// public api routes for reservations
Route::prefix('reservations')->group(function () {     
  Route::post('/store', [ReservationController::class, 'store']);
  Route::post('/check', [ReservationController::class, 'check']); // check reservation
});


// protected routes
Route::middleware('auth:api')->group(function (){
  
  // logout
  Route::prefix('/auth')->group(function(){
    Route::post('/logout', [AuthController::class, 'logout']);
  });

  // harus login terlebih dahulu 
  // Route::prefix('/reservations')->group(function () {            
  //   Route::post('/store', [ReservationController::class, 'store']);
  // });
  

  // admin only routes -> hanya bisa di akses oleh admin
  Route::middleware('role:admin')->group(function () {
    // locations categories routes 
    Route::prefix('/locations-categories')->group(function () {
      Route::post('/', [LocationCategoryController::class, 'store']); // create location category
      Route::get('/', [LocationCategoryController::class, 'index']); // list location categories 
      Route::put('/{id}', [LocationCategoryController::class, 'update']); // update location category
      Route::delete('/{id}', [LocationCategoryController::class, 'destroy']); // delete location category
    });

    // location 
    Route::prefix('/location')->group(function () {
      Route::post('/', [LocationController::class, 'store']); // create location      
      Route::put('/{id}', [LocationController::class, 'update']); // update location
      Route::delete('/{id}', [LocationController::class, 'destroy']); // delete location      
    });

    // reservations
    Route::prefix('/reservations')->group(function () {                  
      Route::get('/', [ReservationController::class, 'index']); // get all reservations
      Route::get('/filter/check', [ReservationController::class, 'filter']); // get  filter reservations      
      Route::delete('/{id}', [ReservationController::class, 'destroy']); // delete reservation
    });
    
  });
  
});