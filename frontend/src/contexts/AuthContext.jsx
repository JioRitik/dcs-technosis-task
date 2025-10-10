import React, { createContext, useContext, useReducer, useEffect } from 'react'
import api from '../Services/api'

const AuthContext = createContext()

const authReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        case 'SET_USER':
            return { ...state, user: action.payload, loading: false }
        case 'SET_TOKEN':
            return { ...state, token: action.payload }
        case 'LOGOUT':
            return { user: null, token: null, loading: false }
        default:
            return state
    }
}

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        token: localStorage.getItem('token'),
        loading: true
    })

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            fetchUser()
        } else {
            dispatch({ type: 'SET_LOADING', payload: false })
        }
    }, [])

    const fetchUser = async () => {
        try {
            const response = await api.get('/profile')
            dispatch({ type: 'SET_USER', payload: response.data.user })
        } catch (error) {
            logout()
        }
    }

    const login = async (credentials) => {
        try {
            console.log("login func AuthContext ========= ", credentials);
            
            const response = await api.post('/login', credentials)
            console.log("login func res ========= ", response);
            const { user, token } = response.data

            localStorage.setItem('token', token)
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            dispatch({ type: 'SET_USER', payload: user })
            dispatch({ type: 'SET_TOKEN', payload: token })

            return { success: true }
        } catch (error) {
            console.log("login func error =====",error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            }
        }
    }

    const register = async (userData) => {
        try {
            const response = await api.post('/register', userData)
            const { user, token } = response.data

            localStorage.setItem('token', token)
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            dispatch({ type: 'SET_USER', payload: user })
            dispatch({ type: 'SET_TOKEN', payload: token })

            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors || { general: ['Registration failed'] }
            }
        }
    }

    const logout = async () => {
        try {
            await api.post('/logout')
        } catch (error) {
            // Handle logout error silently
        } finally {
            localStorage.removeItem('token')
            delete api.defaults.headers.common['Authorization']
            dispatch({ type: 'LOGOUT' })
        }
    }

    const value = {
        user: state.user,
        token: state.token,
        loading: state.loading,
        login,
        register,
        logout,
        isAdmin: state.user?.role === 'admin',
        isAuthenticated: !!state.user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}