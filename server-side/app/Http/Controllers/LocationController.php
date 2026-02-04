<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Locale;
use Illuminate\Validation\Rule;

class LocationController extends Controller
{
    // create location 
    public function store(Request $request){

      // validate request
      $validated = $request->validate([
        'name' => 'required|string|min:3|max:100|unique:locations,name',
        'description' => 'required|string|min:10',
        'address' => 'required|string|min:10',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        'category_id' => 'required|exists:location_categories,id',
      ]);

      // create location 
      $location = Location::create($validated);

      return response()->json([
        'success' => true,
        'message' => 'Location created successfully',
        'data' => $location,
        'errors' => null
      ], 201);

    }

    public function index(Request $request){
      // pagination 
      $perPage = $request->input('per_page', 10);
      $perPage = min($perPage, 15);

      $locations = Location::with('category')->paginate($perPage);

      return response()->json([
        'success' => true,
        'message' => 'Locations retrieved successfully',
        'data' => $locations,
        'pagination' => [
          'total' => $locations->total(),
          'per_page' => $locations->perPage(),
          'current_page' => $locations->currentPage(),
          'last_page' => $locations->lastPage(),          
        ],
        'errors' => null
      ], 200);
    }

    public function show($id){
      
      // get location by id
      $location = Location::findOrFail($id);

      return response()->json([
        'success' => true,
        'message' => 'Location retrieved successfully',
        'data' => $location,
        'errors' => null
      ], 200);      
    }

    public function filler(Request $request){
      $query = Location::with('category');

      if ($request->has('category_id')) {
        $query->where('category_id', $request->input('category_id'));
      }

      if ($request->filled('search')) {
        $query->where('name', 'like', '%' . $request->search . '%');
      }

      $locations = $query->get();

      return response()->json([
        'success' => true,
        'message' => 'Filtered locations retrieved successfully',
        'data' => $locations,
        'errors' => null
      ], 200);
    }

    public function update(Request $request, $id)
    {
      $location = Location::findOrFail($id);

      $validated = $request->validate([
          'name' => [
              'required',
              'string',
              'min:3',
              'max:100',
              Rule::unique('locations', 'name')->ignore($id),
          ],
          'description' => 'required|string|min:10',
          'address' => 'required|string|min:10',
          'category_id' => 'required|exists:location_categories,id',
          'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
      ]);

      // kalau ada image, simpan
      if ($request->hasFile('image')) {
          $validated['image'] = $request->file('image')->store('locations', 'public');
      }

      $location->update($validated);

      return response()->json([
          'message' => 'Location berhasil diupdate',
          'data' => $location
      ]);
    }

    public function destroy($id){
      $location = Location::findOrFail($id);
      $location->delete();

      return response()->json([
        'success' => true,
        'message' => 'Location deleted successfully',
        'data' => null,
        'errors' => null
      ], 200);
    }
}
