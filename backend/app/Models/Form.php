<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
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

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    // Scopes for better query organization
    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true)
              ->where('start_date', '<=', now())
              ->where('end_date', '>=', now());
    }

    public function scopeAvailable(Builder $query): void
    {
        $query->active()
              ->where(function ($q) {
                  $q->whereNull('max_submissions')
                    ->orWhereRaw('(SELECT COUNT(*) FROM submissions WHERE form_id = forms.id) < max_submissions');
              });
    }

    // Check if form is currently available for submission
    public function isAvailable(): bool
    {
        if (!$this->is_active) return false;
        if ($this->start_date > now() || $this->end_date < now()) return false;
        if ($this->max_submissions && $this->submissions()->count() >= $this->max_submissions) return false;
        return true;
    }
}
