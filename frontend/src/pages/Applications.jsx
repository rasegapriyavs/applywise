import { useEffect, useMemo, useState } from 'react'
import ApplicationForm from '../components/ApplicationForm.jsx'
import ApplicationTable from '../components/ApplicationTable.jsx'
import Icon from '../components/Icon.jsx'
import SearchFilter from '../components/SearchFilter.jsx'

function ErrorState({ message, onRetry }) {
  return (
    <section className="state-card error-state" role="alert">
      <div className="state-icon state-icon-error">!</div>
      <h2>We couldn't load your applications</h2>
      <p>{message}</p>
      <p className="state-hint">Check that the Spring Boot API is running at http://localhost:8081/api/applications.</p>
      <button className="button button-primary" onClick={onRetry}>Try again <Icon name="arrow" size={17} /></button>
    </section>
  )
}

export default function Applications({
  applications,
  loading,
  error,
  actionError,
  createRequest = 0,
  onRetry,
  onSave,
  onDelete,
  fixedStatus,
}) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState(fixedStatus || 'All statuses')
  const [modalApplication, setModalApplication] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [localActionError, setLocalActionError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (createRequest > 0) openCreate()
  }, [createRequest])

  const sortedApplications = useMemo(
    () => [...applications].sort((a, b) =>
      (b.applicationDate || '').localeCompare(a.applicationDate || '') || Number(b.id) - Number(a.id),
    ),
    [applications],
  )

  const filteredApplications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return sortedApplications.filter((application) => {
      const matchesStatus = fixedStatus
        ? application.status === fixedStatus
        : statusFilter === 'All statuses' || application.status === statusFilter
      const searchable = [application.companyName, application.jobRole, application.notes]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return matchesStatus && (!normalizedQuery || searchable.includes(normalizedQuery))
    })
  }, [fixedStatus, query, sortedApplications, statusFilter])

  function openCreate() {
    setModalApplication(null)
    setFormError('')
    setModalOpen(true)
  }

  function openEdit(application) {
    setModalApplication(application)
    setFormError('')
    setModalOpen(true)
  }

  async function saveApplication(payload) {
    setSaving(true)
    setFormError('')
    try {
      await onSave(modalApplication, payload)
      setModalOpen(false)
    } catch (saveError) {
      setFormError(saveError.message || 'Could not save the application.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteApplication(application) {
    if (!window.confirm(`Delete the application to ${application.companyName}? This cannot be undone.`)) return
    setDeletingId(application.id)
    setLocalActionError('')
    try {
      await onDelete(application.id)
    } catch (deleteError) {
      setLocalActionError(deleteError.message || 'Could not delete the application.')
    } finally {
      setDeletingId(null)
    }
  }

  const title = fixedStatus === 'Interview' ? 'Interviews' : 'Your applications'
  const subtitle = fixedStatus
    ? 'Keep track of upcoming conversations and interview progress.'
    : "Keep track of every opportunity you're pursuing."

  return (
    <div className="page-content">
      <section className="welcome-row">
        <div>
          <div className="eyebrow welcome-eyebrow">YOUR JOB SEARCH</div>
          <h1>{fixedStatus ? 'Interview' : 'Every opportunity'} <span>in view.</span></h1>
          <p className="welcome-copy">{fixedStatus ? 'Stay ready for every conversation.' : 'A clear view of where things stand.'}</p>
        </div>
        {!fixedStatus && (
          <button className="button button-primary new-application" onClick={openCreate}>
            <Icon name="plus" size={18} /> New application
          </button>
        )}
      </section>

      {error ? <ErrorState message={error} onRetry={onRetry} /> : (
        <section className="applications-panel" id="applications">
          <div className="panel-heading">
            <div>
              <div className="panel-title-row"><h2>{title}</h2><span className="result-count">{loading ? '…' : filteredApplications.length}</span></div>
              <p>{subtitle}</p>
            </div>
            {!fixedStatus && (
              <button className="button button-outline panel-add" onClick={openCreate}><Icon name="plus" size={17} /> Add new</button>
            )}
          </div>

          {(actionError || localActionError) && (
            <div className="inline-error" role="alert">{localActionError || actionError}</div>
          )}
          {!loading && (
            <SearchFilter
              query={query}
              status={statusFilter}
              onQueryChange={setQuery}
              onStatusChange={setStatusFilter}
              fixedStatus={fixedStatus}
            />
          )}
          {loading ? (
            <div className="loading-state" role="status"><span className="spinner" />Loading your applications…</div>
          ) : (
            <ApplicationTable
              applications={filteredApplications}
              totalCount={fixedStatus ? applications.filter((item) => item.status === fixedStatus).length : applications.length}
              onEdit={openEdit}
              onDelete={deleteApplication}
              deletingId={deletingId}
              emptyTitle={fixedStatus
                ? 'No interviews on the calendar yet.'
                : applications.length === 0 ? 'A fresh start looks good on you.' : 'No applications match that search.'}
              emptyMessage={fixedStatus
                ? 'Applications marked Interview will show up here.'
                : applications.length === 0 ? 'Add your first opportunity and keep your job search moving.' : 'Try another company, role, or status filter.'}
              onAdd={applications.length === 0 && !fixedStatus ? openCreate : undefined}
            />
          )}
        </section>
      )}

      <footer className="page-footer"><span>One application at a time. You've got this.</span><span>APPLYWISE <span className="brand-period">•</span> YOUR CAREER, YOUR PACE</span></footer>
      {modalOpen && (
        <ApplicationForm
          key={modalApplication?.id || 'new'}
          application={modalApplication}
          onClose={() => setModalOpen(false)}
          onSave={saveApplication}
          saving={saving}
          error={formError}
        />
      )}
    </div>
  )
}
