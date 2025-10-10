import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useQuery } from '@tanstack/react-query'
import api from '../Services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth()

  // Fetch user submissions
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['user-submissions'],
    queryFn: async () => {
      const response = await api.get('/my-submissions')
      return response.data.submissions
    }
  })

  if (isLoading) {
    return <LoadingSpinner text="Loading dashboard..." />
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
                <Link to="/dashboard" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
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
                className="uppercase text-white-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Welcome to your Dashboard
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Manage your exam registrations, view submission history, and track payment status.
                </p>
              </div>
              <div className="mt-5">
                <Link
                  to="/forms"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Browse Available Forms
                </Link>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">📝</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Submissions
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {submissions?.data?.length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Completed
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {submissions?.data?.filter(s => s.status === 'completed').length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">⏳</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {submissions?.data?.filter(s => s.status === 'pending').length || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">💳</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Paid
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ₹{submissions?.data?.reduce((total, s) => 
                          s.payment?.status === 'success' ? total + parseFloat(s.payment.amount) : total, 0
                        ) || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Submissions
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Your recent exam form submissions and payment status
              </p>
            </div>
            
            {submissions?.data?.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by submitting your first exam form.</p>
                <div className="mt-6">
                  <Link
                    to="/forms"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Browse Forms
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {submissions?.data?.slice(0, 5).map((submission) => (
                  <li key={submission.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              submission.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {submission.status === 'completed' ? '✓' : '⏳'}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {submission.form.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              Submitted on {new Date(submission.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              submission.payment?.status === 'success'
                                ? 'bg-green-100 text-green-800'
                                : submission.payment?.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {submission.payment?.status === 'success' 
                                ? `Paid ₹${submission.payment.amount}` 
                                : submission.payment?.status === 'pending'
                                ? 'Payment Pending'
                                : 'No Payment'
                              }
                            </span>
                          </div>
                          {submission.status === 'pending' && (
                            <Link
                              to={`/payment/${submission.id}`}
                              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            >
                              Complete Payment
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
