import { useMutation } from '@tanstack/react-query'
import api from '../Services/api'

export const useRazorpayPayment = () => {
  return useMutation({
    mutationFn: async (submissionId) => {
      const response = await api.post(`/submissions/${submissionId}/payment/razorpay/create`)
      return response.data
    }
  })
}

export const useVerifyRazorpayPayment = () => {
  return useMutation({
    mutationFn: async (paymentData) => {
      const response = await api.post('/payments/razorpay/verify', paymentData)
      return response.data
    }
  })
}

export const useStripePayment = () => {
  return useMutation({
    mutationFn: async ({ submissionId, paymentMethodId }) => {
      const response = await api.post(`/submissions/${submissionId}/payment/stripe/process`, {
        payment_method_id: paymentMethodId
      })
      return response.data
    }
  })
}