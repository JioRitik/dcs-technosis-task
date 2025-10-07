<?php
namespace App\Services;

use App\Models\Payment;
use Barryvdh\DomPDF\Facade\Pdf;

class PDFService
{
    public function generateReceipt(Payment $payment): string
    {
        $data = [
            'payment' => $payment->load(['user', 'submission.form']),
            'generated_at' => now()
        ];

        $pdf = Pdf::loadView('pdf.receipt', $data);

        $filename = 'receipt_' . $payment->receipt_number . '.pdf';
        $path = storage_path('app/public/receipts/' . $filename);

        // Ensure directory exists
        if (!file_exists(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        $pdf->save($path);

        return $filename;
    }
}
