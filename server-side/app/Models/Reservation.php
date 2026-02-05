<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    /** @use HasFactory<\Database\Factories\ReservationFactory> */
    use HasFactory;

    protected $fillable = [      
      'location_id',
      'customer_name',
      'address',
      'phone_number',
      'reservation_date',
      'note',
      'order_number',
      'user_id',
    ];

    // relation between reservation and user
    public function user(){
      return $this->belongsTo(User::class);
    }

    public function location(){
      return $this->belongsTo(Location::class);
    }
}
