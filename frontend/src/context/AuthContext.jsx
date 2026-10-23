import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import authService from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    let active = true
    authService.getCsrfToken()
      .then(() => authService.getCurrentUser())
      .then((currentUser) => {
        if (active) setUser(currentUser)
      })
      .catch((error) => {
        if (!active) return
        if (error.status !== 401) setAuthError(error.message || 'Could not connect to the authentication API.')
      })
      .finally(() => {
        if (active) setInitializing(false)
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    function expireAuthentication() {
      setUser(null)
    }
    window.addEventListener('auth:expired', expireAuthentication)
    return () => window.removeEventListener('auth:expired', expireAuthentication)
  }, [])

  const login = useCallback(async (credentials) => {
    setAuthError('')
    const response = await authService.login(credentials)
    setUser(response.user)
    return response.user
  }, [])

  const register = useCallback(async (account) => {
    setAuthError('')
    const response = await authService.register(account)
    setUser(response.user)
    return response.user
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
    setAuthError('')
  }, [])

  const updateProfile = useCallback(async (profile) => {
    const updatedUser = await authService.updateProfile(profile)
    setUser(updatedUser)
    return updatedUser
  }, [])

  const changePassword = useCallback((passwords) => authService.changePassword(passwords), [])

  const value = useMemo(() => ({
    user,
    initializing,
    authError,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  }), [user, initializing, authError, login, register, logout, updateProfile, changePassword])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider.')
  return context
}
