// src/pages/Payment.jsx
import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useQuery } from '@tanstack/react-query'
import PaymentGateway from '../components/PaymentGateway'
import LoadingSpinner from '../components/LoadingSpinner'
import api from '../Services/api'

const Payment = () => {
  const { submissionId } = useParams()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [paymentComplete, setPaymentComplete] = useState(false)
  
  // Fetch submission details
  const { data: submission, isLoading, error } = useQuery({
    queryKey: ['submission', submissionId],
    queryFn: async () => {
      const response = await api.get(`/my-submissions`)
      const submissions = response.data.submissions.data
      return submissions.find(s => s.id == submissionId)
    },
    enabled: !!submissionId
  })

  const handlePaymentSuccess = (paymentData) => {
    setPaymentComplete(true)
    setTimeout(() => {
      navigate('/dashboard')
    }, 3000)
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading payment details..." />
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Submission not found</h3>
          <p className="text-sm text-gray-500 mt-2">The requested submission could not be loaded.</p>
          <Link to="/dashboard" className="mt-4 text-indigo-600 hover:text-indigo-500">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // If payment already completed
  if (submission.payment && submission.payment.status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Already Completed</h3>
            <p className="text-sm text-gray-500 mb-4">
              Payment for this submission has already been processed successfully.
            </p>
            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Receipt Number: </span>
                <span className="text-gray-600">{submission.payment.receipt_number}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Amount: </span>
                <span className="text-gray-600">₹{submission.payment.amount}</span>
              </div>
              <Link
                to="/dashboard"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 inline-block"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-sm text-gray-500 mb-4">
              Your payment has been processed successfully. Redirecting to dashboard...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                Exam Portal
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="uppercase text-white-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-gray-500">
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500">Payment</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Exam Form</h4>
                  <p className="mt-1 text-sm text-gray-900">{submission.form.title}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Candidate</h4>
                  <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Submission Date</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(submission.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-indigo-600">₹{submission.form.amount}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Secure Payment
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Your payment information is processed securely using industry-standard encryption.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Gateway */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Complete Your Payment
              </h3>
              
              <PaymentGateway 
                submission={submission}
                onSuccess={handlePaymentSuccess}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
