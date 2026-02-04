<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LocationCategory extends Model
{
    /** @use HasFactory<\Database\Factories\LocationCategoriesFactory> */
    use HasFactory;

    protected $fillable = [
      'name',
    ];

    public function locations(){
      return $this->hasMany(Location::class);
    }
}
