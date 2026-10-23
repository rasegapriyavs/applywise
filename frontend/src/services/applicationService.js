import authService from './authService.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/applications'

async function request(path = '', options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  }

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    headers['X-XSRF-TOKEN'] = await authService.getCsrfToken()
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    method,
    credentials: 'include',
    headers,
  })

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth:expired'))
    }
    let message = `Request failed (${response.status})`
    try {
      const error = await response.json()
      message = error.detail || error.message || error.error || message
    } catch {
      if (response.statusText) message = `${message}: ${response.statusText}`
    }
    throw new Error(message)
  }

  if (response.status === 204) return null
  return response.json()
}

const applicationService = {
  async getAll() {
    const applications = await request()
    if (!Array.isArray(applications)) {
      throw new Error('The applications API returned an unexpected response.')
    }
    return applications
  },

  create(application) {
    return request('', { method: 'POST', body: JSON.stringify(application) })
  },

  update(id, application) {
    return request(`/${id}`, { method: 'PUT', body: JSON.stringify(application) })
  },

  delete(id) {
    return request(`/${id}`, { method: 'DELETE' })
  },
}

export default applicationService
