<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'description', 'fields', 'amount',
        'start_date', 'end_date', 'is_active', 'max_submissions'
    ];

    protected function casts(): array
    {
        return [
            'fields' => 'array',
            'amount' => 'decimal:2',
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'is_active' => 'boolean',
        ];
    }
}
