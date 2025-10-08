import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import LoadingSpinner from './components/LoadingSpinner'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// Lazy loading components for better performance
const Home = React.lazy(() => import('./pages/Home'))
const Login = React.lazy(() => import('./pages/Login'))
const Register = React.lazy(() => import('./pages/Register'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Forms = React.lazy(() => import('./pages/Forms'))
const FormDetail = React.lazy(() => import('./pages/FormDetail'))
const Payment = React.lazy(() => import('./pages/Payment'))
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'))
const AdminForms = React.lazy(() => import('./pages/admin/AdminForms'))

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/forms" element={
              <ProtectedRoute>
                <Forms />
              </ProtectedRoute>
            } />
            
            <Route path="/forms/:id" element={
              <ProtectedRoute>
                <FormDetail />
              </ProtectedRoute>
            } />
            
            <Route path="/payment/:submissionId" element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            
            <Route path="/admin/forms" element={
              <AdminRoute>
                <AdminForms />
              </AdminRoute>
            } />
          </Routes>
        </Suspense>
      </div>
    </AuthProvider>
  )
}

export default App