const APPLICATIONS_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/applications'
const API_ROOT = APPLICATIONS_URL.replace(/\/applications\/?$/, '')

async function request(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  }

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    headers['X-XSRF-TOKEN'] = await getCsrfToken()
  }

  const response = await fetch(`${API_ROOT}${path}`, {
    ...options,
    method,
    credentials: 'include',
    headers,
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const error = await response.json()
      message = error.message || error.detail || error.error || message
    } catch {
      if (response.statusText) message = `${message}: ${response.statusText}`
    }
    const requestError = new Error(message)
    requestError.status = response.status
    throw requestError
  }

  if (response.status === 204) return null
  return response.json()
}

async function getCsrfToken() {
  const response = await fetch(`${API_ROOT}/auth/csrf`, {
    credentials: 'include',
  })
  if (!response.ok) {
    throw new Error(`Could not initialize secure requests (${response.status}).`)
  }
  const data = await response.json()
  if (!data.token) throw new Error('The API did not return a CSRF token.')
  return data.token
}

const authService = {
  getCsrfToken,

  register(account) {
    return request('/auth/register', { method: 'POST', body: JSON.stringify(account) })
  },

  login(credentials) {
    return request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
  },

  getCurrentUser() {
    return request('/users/me')
  },

  updateProfile(profile) {
    return request('/users/me', { method: 'PUT', body: JSON.stringify(profile) })
  },

  changePassword(passwords) {
    return request('/users/me/password', { method: 'PUT', body: JSON.stringify(passwords) })
  },

  logout() {
    return request('/auth/logout', { method: 'POST' })
  },
}

export default authService
