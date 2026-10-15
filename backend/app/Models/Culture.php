<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Culture extends Model
{
    protected $fillable = [
        'province_id', 'category_id', 'title', 'slug', 'image', 'desc', 'featured',
        'status', 'source', 'history', 'facts', 'images', 'created_by', 'updated_by',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'facts' => 'array',
        'images' => 'array',
    ];

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
