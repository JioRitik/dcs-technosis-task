import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

const AdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner text="Checking permissions..." />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Access Denied</h3>
            <p className="mt-2 text-sm text-gray-500">
              You don't have administrator privileges to access this page.
            </p>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200"
              >
                Go Back
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return children
}

export default AdminRoute