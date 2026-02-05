<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;



class ReservationController extends Controller
{
    // create reservation 
    public function store(Request $request){
      
      // validasi input/request dari user
      $validated = $request->validate([
        'customer_name' => 'required|string|min:3|max:100',
        'address' => 'required|string|min:10',
        'phone_number' => 'required|string|max:15',
        'date' => 'required|date',
        'location_id' => 'required|exists:locations,id',
        'note' => 'nullable|string',
      ]);

      // simpan data ke database 
      $reservation = Reservation::create([
        'customer_name' => $validated['customer_name'],
        'address' => $validated['address'],
        'phone_number' => $validated['phone_number'],
        'reservation_date' => $validated['date'],
        'location_id' => $validated['location_id'],
        'note' => $validated['note'] ?? null,
        'order_number' => 'ORD-' . strtoupper(Str::random(8)),
        'user_id' => Auth::id(),
      ]);

      return response()->json([
        'success' => true,
        'message' => 'Reservation created successfully',
        'data' => $reservation,
        'errors' => null
      ], 201);
    }

    public function index(){

      $reservations = Reservation::with('location')->get();

      return response()->json([
        'success' => true,
        'message' => 'Reservations retrieved successfully',
        'data' => $reservations,
        'errors' => null
      ], 200);
    }

    public function filter(Request $request)
    {
      $query = Reservation::query();

      // filter berdasarkan lokasi
      if ($request->filled('location_id')) {
          $query->where('location_id', $request->location_id);
      }

      // filter berdasarkan tanggal
      if ($request->filled('date')) {
          $query->whereDate('reservation_date', $request->date);
      }

      // search (OR condition)
      if ($request->filled('search')) {
          $search = $request->search;

          $query->where(function ($q) use ($search) {
              $q->where('order_number', 'like', "%{$search}%")
                ->orWhere('customer_name', 'like', "%{$search}%")
                ->orWhere('address', 'like', "%{$search}%")
                ->orWhere('note', 'like', "%{$search}%")
                ->orWhere('phone_number', 'like', "%{$search}%");
          });
      }

      $reservations = $query->latest()->get();

      return response()->json([
          'data' => $reservations
      ]);
    }

    public function check(Request $request){
        $validated = $request->validate([
            'order_number' => 'required|string|min:8|max:20',
            'phone_number' => 'required|string|max:15',
        ]);
    
        $reservation = Reservation::where('order_number', $validated['order_number'])
            ->where('phone_number', $validated['phone_number'])
            ->first();
    
        if (!$reservation) {
            return response()->json([
                'message' => 'Reservasi tidak ditemukan'
            ], 404);
        }
    
        return response()->json([
            'message' => 'Reservasi ditemukan',
            'data' => $reservation
        ]);
    }

    public function destroy($id){
        $reservation = Reservation::findOrFail($id);

        $reservation->delete();

        return response()->json([
            'message' => 'Reservasi berhasil dihapus'
        ]);
    }

}