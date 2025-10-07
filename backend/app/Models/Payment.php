<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'submission_id', 'payment_id', 'order_id',
        'amount', 'currency', 'gateway', 'status',
        'gateway_response', 'paid_at', 'receipt_number'
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'gateway_response' => 'array',
            'paid_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function submission()
    {
        return $this->belongsTo(Submission::class);
    }

    public function isSuccessful(): bool
    {
        return $this->status === 'success';
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($payment) {
            if (!$payment->receipt_number) {
                $payment->receipt_number = 'RCP-' . strtoupper(uniqid());
            }
        });
    }
}
