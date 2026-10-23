import Icon from '../components/Icon.jsx'
import ApplicationTable from '../components/ApplicationTable.jsx'
import StatCard from '../components/StatCard.jsx'

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

export default function Dashboard({ applications, loading, error, onRetry, onAdd, onNavigate }) {
  const stats = {
    total: applications.length,
    active: applications.filter((item) => ['Applied', 'Assessment', 'Interview'].includes(item.status)).length,
    interviews: applications.filter((item) => item.status === 'Interview').length,
    offers: applications.filter((item) => item.status === 'Offer').length,
  }
  const recentApplications = [...applications]
    .sort((a, b) => (b.applicationDate || '').localeCompare(a.applicationDate || '') || Number(b.id) - Number(a.id))
    .slice(0, 5)

  return (
    <div className="page-content" id="overview">
      <section className="welcome-row">
        <div>
          <div className="eyebrow welcome-eyebrow">
            {new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' })
              .format(new Date()).toUpperCase()}
          </div>
          <h1>Your next chapter <span>starts here.</span></h1>
          <p className="welcome-copy">Hey there, here's the latest on your job search.</p>
        </div>
        <button className="button button-primary new-application" onClick={onAdd}>
          <Icon name="plus" size={18} /> New application
        </button>
      </section>

      {error ? <ErrorState message={error} onRetry={onRetry} /> : (
        <>
          <section className="stats-grid" aria-label="Application summary">
            <StatCard label="Total applications" value={loading ? '—' : stats.total} detail="All your opportunities, in one place" icon="briefcase" color="purple" trend />
            <StatCard label="In progress" value={loading ? '—' : stats.active} detail="Applied, assessment & interview" icon="clock" color="blue" />
            <StatCard label="Interviews" value={loading ? '—' : stats.interviews} detail="Conversations in progress" icon="calendar" color="orange" />
            <StatCard label="Offers received" value={loading ? '—' : stats.offers} detail="Every step forward counts" icon="check" color="green" />
          </section>

          <section className="applications-panel">
            <div className="panel-heading">
              <div>
                <div className="panel-title-row"><h2>Recent applications</h2><span className="result-count">{loading ? '…' : applications.length}</span></div>
                <p>Your latest opportunities, all in one place.</p>
              </div>
              <button className="button button-outline panel-add" onClick={() => onNavigate('applications')}>View all <Icon name="arrow" size={16} /></button>
            </div>
            {loading ? (
              <div className="loading-state" role="status"><span className="spinner" />Loading your applications…</div>
            ) : (
              <ApplicationTable
                applications={recentApplications}
                totalCount={applications.length}
                emptyTitle="A fresh start looks good on you."
                emptyMessage="Add your first opportunity and keep your job search moving."
                onAdd={onAdd}
              />
            )}
          </section>
          <footer className="page-footer"><span>One application at a time. You've got this.</span><span>APPLYWISE <span className="brand-period">•</span> YOUR CAREER, YOUR PACE</span></footer>
        </>
      )}
    </div>
  )
}
