<?php

namespace App\Http\Controllers;

use App\Models\LocationCategory;
use Illuminate\Http\Request;

class LocationCategoryController extends Controller
{
    // store a new location category
    public function store(Request $request){
      $validate = $request->validate([
        'name' => 'required|string|min:3|max:100|unique:location_categories,name',
      ]);

      $category = LocationCategory::create($validate);

      return response()->json([
        'success' => true,
        'message' => 'Location category berhasil dibuat',
        'data' => $category,
        'errors' => null
      ], 201);
    }

    // get all location categories 
    public function index(){
      
      $categories = LocationCategory::all();

      return response()->json([
        'success' => true,
        'message' => 'location categories berhasil di ambil',
        'data' => $categories,
        'errors' => null
      ], 200);
    }

    // get data by id 
    public function show($id){
      // ambil data berdasarkan id 
      $category = LocationCategory::findOrFail($id);

      return response()->json([
        'success' => true,
        'message' => 'Location category berhasil di ambil',
        'data' => $category,
        'errors' => null
      ], 200);
    }

    // update a location category 
    public function update(Request $request, $id){
      // validasi input
      $validate = $request->validate([
        'name' => 'required|string|min:3|max:100|unique:location_categories,name,'.$id,
      ]);

      // ambil data berdasarkan id 
      $category = LocationCategory::findOrFail($id);

      // update data
      $category->update($validate);

      return response()->json([
        'success' => true,
        'message' => 'Location category berhasil di update',
        'data' => $category,
        'errors' => null
      ], 200);
    }

    // delete a location category
    public function destroy($id){
      // ambil data berdasarkan id 
      $category = LocationCategory::findOrFail($id);

      // hapus data
      $category->delete();

      return response()->json([
        'success' => true,
        'message' => 'Location category berhasil di hapus',
        'data' => null,
        'errors' => null
      ], 200);
      
    }
}
