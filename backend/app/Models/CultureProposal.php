<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CultureProposal extends Model
{
    protected $fillable = [
        'user_id', 'title', 'province_name', 'category_name',
        'image_path', 'description', 'source', 'history', 'facts', 'images',
        'copyright_consent', 'status', 'admin_note',
    ];

    protected $casts = [
        'facts' => 'array',
        'images' => 'array',
        'copyright_consent' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
