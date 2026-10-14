<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CultureProposal extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'province_name',
        'category_name',
        'image_path',
        'description',
        'source',
        'history',
        'facts',
        'images',
        'copyright_consent',
        'status',
        'admin_note',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'facts' => 'array',
        'images' => 'array',
        'copyright_consent' => 'boolean',
        'reviewed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
