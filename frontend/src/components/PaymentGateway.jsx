import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useRazorpayPayment, useVerifyRazorpayPayment, useStripePayment } from '../hooks/usePayment'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const PaymentGateway = ({ submission, onSuccess }) => {
  const [selectedGateway, setSelectedGateway] = useState('razorpay')
  const [processing, setProcessing] = useState(false)
  
  const razorpayMutation = useRazorpayPayment()
  const verifyRazorpayMutation = useVerifyRazorpayPayment()

  const handleRazorpayPayment = async () => {
    setProcessing(true)
    
    try {
      const result = await razorpayMutation.mutateAsync(submission.id)
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.razorpay_order.amount,
        currency: result.razorpay_order.currency,
        name: 'Exam Portal',
        description: `Payment for ${submission.form.title}`,
        order_id: result.razorpay_order.id,
        handler: async (response) => {
          try {
            const verifyResult = await verifyRazorpayMutation.mutateAsync(response)
            onSuccess(verifyResult)
          } catch (error) {
            alert('Payment verification failed')
          }
        },
        prefill: {
          name: submission.user.name,
          email: submission.user.email,
          contact: submission.user.phone
        },
        theme: {
          color: '#3B82F6'
        }
      }
      
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      alert('Failed to initiate payment')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Payment Method</h3>
      
      <div className="space-y-4">
        <div>
          <label className="flex items-center">
            <input
              type="radio"
              name="gateway"
              value="razorpay"
              checked={selectedGateway === 'razorpay'}
              onChange={(e) => setSelectedGateway(e.target.value)}
              className="mr-2"
            />
            <span>Razorpay (UPI, Cards, NetBanking)</span>
          </label>
        </div>
        
        <div>
          <label className="flex items-center">
            <input
              type="radio"
              name="gateway"
              value="stripe"
              checked={selectedGateway === 'stripe'}
              onChange={(e) => setSelectedGateway(e.target.value)}
              className="mr-2"
            />
            <span>Stripe (International Cards)</span>
          </label>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="text-sm text-gray-600 mb-4">
          Amount to pay: <span className="font-semibold">₹{submission.form.amount}</span>
        </div>
        
        {selectedGateway === 'razorpay' ? (
          <button
            onClick={handleRazorpayPayment}
            disabled={processing}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {processing ? 'Processing...' : 'Pay with Razorpay'}
          </button>
        ) : (
          <Elements stripe={stripePromise}>
            <StripePaymentForm 
              submission={submission} 
              onSuccess={onSuccess}
              processing={processing}
              setProcessing={setProcessing}
            />
          </Elements>
        )}
      </div>
    </div>
  )
}

const StripePaymentForm = ({ submission, onSuccess, processing, setProcessing }) => {
  const stripe = useStripe()
  const elements = useElements()
  const stripeMutation = useStripePayment()

  const handleStripePayment = async (event) => {
    event.preventDefault()
    
    if (!stripe || !elements) return
    
    setProcessing(true)
    
    try {
      const cardElement = elements.getElement(CardElement)
      
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (error) {
        alert(error.message)
        return
      }

      const result = await stripeMutation.mutateAsync({
        submissionId: submission.id,
        paymentMethodId: paymentMethod.id
      })
      
      onSuccess(result)
    } catch (error) {
      alert('Payment failed')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleStripePayment}>
      <div className="mb-4 p-3 border rounded-md">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {processing ? 'Processing...' : 'Pay with Stripe'}
      </button>
    </form>
  )
}

export default PaymentGateway