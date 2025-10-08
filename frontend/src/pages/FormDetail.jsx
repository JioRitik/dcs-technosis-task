// src/pages/FormDetail.jsx
import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useForm, useSubmitForm } from '../hooks/useForm'
import FormRenderer from '../components/FormRenderer'
import LoadingSpinner from '../components/LoadingSpinner'

const FormDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, logout, isAdmin } = useAuth()
  const [submissionSuccess, setSubmissionSuccess] = useState(null)
  
  const { data: form, isLoading, error } = useForm(id)
  const submitFormMutation = useSubmitForm()

  const handleFormSubmit = async (formData) => {
    try {
      const result = await submitFormMutation.mutateAsync({
        formId: id,
        data: formData
      })
      
      setSubmissionSuccess(result.submission)
      // Redirect to payment page after 2 seconds
      setTimeout(() => {
        navigate(`/payment/${result.submission.id}`)
      }, 2000)
    } catch (error) {
      console.error('Form submission failed:', error)
    }
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading form details..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Form not found</h3>
          <p className="text-sm text-gray-500 mt-2">The requested form could not be loaded.</p>
          <Link to="/forms" className="mt-4 text-indigo-600 hover:text-indigo-500">
            ← Back to Forms
          </Link>
        </div>
      </div>
    )
  }

  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Form Submitted Successfully!</h3>
            <p className="text-sm text-gray-500 mb-4">
              Your form has been submitted. Redirecting to payment page...
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
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link to="/dashboard" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/forms" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Available Forms
                </Link>
                {isAdmin && (
                  <Link to="/admin/dashboard" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                    Admin Panel
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
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
                <Link to="/forms" className="text-gray-400 hover:text-gray-500">
                  <span>Forms</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500">
                    {form?.title}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Details */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {form?.title}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="mt-1 text-sm text-gray-900">{form?.description}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Registration Fee</h4>
                  <p className="mt-1 text-2xl font-bold text-indigo-600">₹{form?.amount}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Registration Period</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(form?.start_date).toLocaleDateString()} - {new Date(form?.end_date).toLocaleDateString()}
                  </p>
                </div>
                
                {form?.max_submissions && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Maximum Registrations</h4>
                    <p className="mt-1 text-sm text-gray-900">{form?.max_submissions}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Important Notice
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Payment is required to complete your registration. You'll be redirected to the payment page after form submission.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Registration Form
              </h3>
              
              <FormRenderer 
                form={form}
                onSubmit={handleFormSubmit}
                loading={submitFormMutation.isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormDetail
