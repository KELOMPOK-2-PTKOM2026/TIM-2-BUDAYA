<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Province extends Model
{
    protected $fillable = ['name', 'slug', 'image', 'tag'];

    public function cultures(): HasMany
    {
        return $this->hasMany(Culture::class);
    }
}
