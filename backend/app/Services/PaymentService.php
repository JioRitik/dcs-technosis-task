<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Submission;
use Exception;
use Stripe;

class PaymentService
{
    public function createRazorpayOrder(Submission $submission): array
    {
        $api = new \Razorpay\Api\Api(config('services.razorpay.key'), config('services.razorpay.secret'));

        $orderData = [
            'receipt' => 'order_' . $submission->id,
            'amount' => $submission->form->amount * 100, // Amount in paise
            'currency' => 'INR',
        ];

        $razorpayOrder = $api->order->create($orderData);

        $payment = Payment::create([
            'user_id' => $submission->user_id,
            'submission_id' => $submission->id,
            'order_id' => $razorpayOrder['id'],
            'amount' => $submission->form->amount,
            'currency' => 'INR',
            'gateway' => 'razorpay',
            'status' => 'pending'
        ]);

        return [
            'payment' => $payment,
            'razorpay_order' => $razorpayOrder
        ];
    }

    public function verifyRazorpayPayment(array $paymentData): Payment
    {
        $api = new \Razorpay\Api\Api(config('services.razorpay.key'), config('services.razorpay.secret'));

        try {
            $attributes = [
                'razorpay_order_id' => $paymentData['razorpay_order_id'],
                'razorpay_payment_id' => $paymentData['razorpay_payment_id'],
                'razorpay_signature' => $paymentData['razorpay_signature']
            ];

            $api->utility->verifyPaymentSignature($attributes);

            $payment = Payment::where('order_id', $paymentData['razorpay_order_id'])->firstOrFail();

            $payment->update([
                'payment_id' => $paymentData['razorpay_payment_id'],
                'status' => 'success',
                'paid_at' => now(),
                'gateway_response' => $paymentData
            ]);

            // Update submission status
            $payment->submission->update(['status' => 'completed']);

            return $payment;

        } catch (Exception $e) {
            throw new Exception('Payment verification failed: ' . $e->getMessage());
        }
    }

    public function processStripePayment(Submission $submission, string $paymentMethodId): Payment
    {
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            $paymentIntent = \Stripe\PaymentIntent::create([
                'amount' => $submission->form->amount * 100, // Amount in cents
                'currency' => 'usd',
                'payment_method' => $paymentMethodId,
                'confirmation_method' => 'manual',
                'confirm' => true,
                'metadata' => [
                    'submission_id' => $submission->id,
                    'user_id' => $submission->user_id
                ]
            ]);

            $payment = Payment::create([
                'user_id' => $submission->user_id,
                'submission_id' => $submission->id,
                'payment_id' => $paymentIntent->id,
                'amount' => $submission->form->amount,
                'currency' => 'USD',
                'gateway' => 'stripe',
                'status' => $paymentIntent->status === 'succeeded' ? 'success' : 'pending',
                'paid_at' => $paymentIntent->status === 'succeeded' ? now() : null,
                'gateway_response' => $paymentIntent->toArray()
            ]);

            if ($paymentIntent->status === 'succeeded') {
                $payment->submission->update(['status' => 'completed']);
            }

            return $payment;

        } catch (Exception $e) {
            throw new Exception('Stripe payment failed: ' . $e->getMessage());
        }
    }
}
