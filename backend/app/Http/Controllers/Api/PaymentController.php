<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Services\PaymentService;
use App\Services\PDFService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentService $paymentService,
        private PDFService $pdfService
    ) {}

    public function createRazorpayOrder(Request $request, Submission $submission): JsonResponse
    {
        try {
            if ($submission->user_id !== $request->user()->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $result = $this->paymentService->createRazorpayOrder($submission);

            return response()->json([
                'payment' => $result['payment'],
                'razorpay_order' => $result['razorpay_order']
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function verifyRazorpayPayment(Request $request): JsonResponse
    {
        $request->validate([
            'razorpay_order_id' => 'required',
            'razorpay_payment_id' => 'required',
            'razorpay_signature' => 'required'
        ]);

        try {
            $payment = $this->paymentService->verifyRazorpayPayment($request->all());

            // Generate PDF receipt
            $receiptFile = $this->pdfService->generateReceipt($payment);

            return response()->json([
                'message' => 'Payment verified successfully',
                'payment' => $payment,
                'receipt_url' => asset('storage/receipts/' . $receiptFile)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function processStripePayment(Request $request, Submission $submission): JsonResponse
    {
        $request->validate([
            'payment_method_id' => 'required|string'
        ]);

        try {
            if ($submission->user_id !== $request->user()->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $payment = $this->paymentService->processStripePayment(
                $submission,
                $request->payment_method_id
            );

            if ($payment->isSuccessful()) {
                $receiptFile = $this->pdfService->generateReceipt($payment);

                return response()->json([
                    'message' => 'Payment processed successfully',
                    'payment' => $payment,
                    'receipt_url' => asset('storage/receipts/' . $receiptFile)
                ]);
            }

            return response()->json([
                'message' => 'Payment requires additional action',
                'payment' => $payment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
