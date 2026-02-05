<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    /** @use HasFactory<\Database\Factories\LocationFactory> */
    use HasFactory;

    protected $fillable = [
      'name',      
      'address',
      'image',
      'category_id',
      'description',
    ];

    // relation between location and reservation
    public function reservations(){
      return $this->hasMany(Reservation::class);
    }

    public function category(){
      return $this->belongsTo(LocationCategory::class);
    }
}
