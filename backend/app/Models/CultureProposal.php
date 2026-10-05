<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CultureProposal extends Model
{
    protected $fillable = [
        'user_id', 'title', 'province_name', 'category_name',
        'image_path', 'description', 'status', 'admin_note',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
