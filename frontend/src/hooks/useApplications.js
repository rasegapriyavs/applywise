import { useCallback, useEffect, useState } from 'react'
import applicationService from '../services/applicationService.js'

export default function useApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  const reload = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setApplications(await applicationService.getAll())
    } catch (requestError) {
      setError(requestError.message || 'Could not load applications.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const createApplication = useCallback(async (application) => {
    const created = await applicationService.create(application)
    setApplications((current) => [...current, created])
    setActionError('')
    return created
  }, [])

  const updateApplication = useCallback(async (id, application) => {
    const updated = await applicationService.update(id, application)
    setApplications((current) => current.map((item) => item.id === id ? updated : item))
    setActionError('')
    return updated
  }, [])

  const deleteApplication = useCallback(async (id) => {
    try {
      await applicationService.delete(id)
      setApplications((current) => current.filter((item) => item.id !== id))
      setActionError('')
    } catch (requestError) {
      const message = requestError.message || 'Could not delete the application.'
      setActionError(message)
      throw requestError
    }
  }, [])

  return {
    applications,
    loading,
    error,
    actionError,
    reload,
    createApplication,
    updateApplication,
    deleteApplication,
  }
}
