import Icon from './Icon.jsx'
import StatusBadge from './StatusBadge.jsx'

function formatDate(date) {
  if (!date) return 'Not set'
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(`${date}T00:00:00`))
}

function getInitials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function ApplicationTable({
  applications,
  totalCount = applications.length,
  onEdit,
  onDelete,
  deletingId,
  emptyTitle = 'A fresh start looks good on you.',
  emptyMessage = 'Add your first opportunity and keep your job search moving.',
  onAdd,
}) {
  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-illustration">
          <span className="empty-spark"><Icon name="spark" size={24} /></span>
          <span className="empty-card"><Icon name="briefcase" size={27} /></span>
        </div>
        <h3>{emptyTitle}</h3>
        <p>{emptyMessage}</p>
        {onAdd && <button className="button button-primary" onClick={onAdd}><Icon name="plus" size={17} /> Add your first application</button>}
      </div>
    )
  }

  return (
    <div className="table-scroll">
      <table className="applications-table">
        <thead>
          <tr>
            <th>COMPANY &amp; ROLE</th>
            <th>DATE APPLIED</th>
            <th>STATUS</th>
            <th>NOTES</th>
            {(onEdit || onDelete) && <th><span className="sr-only">Actions</span></th>}
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td>
                <div className="company-cell">
                  <span className={`company-avatar avatar-${(application.companyName || 'x').charCodeAt(0) % 6}`}>
                    {getInitials(application.companyName)}
                  </span>
                  <span className="company-details">
                    <strong>{application.companyName}</strong>
                    <span>{application.jobRole}</span>
                  </span>
                </div>
              </td>
              <td className="date-cell">{formatDate(application.applicationDate)}</td>
              <td><StatusBadge status={application.status} /></td>
              <td className="notes-cell" title={application.notes || ''}>
                {application.notes || <span className="muted-dash">—</span>}
              </td>
              {(onEdit || onDelete) && (
                <td>
                  <div className="row-actions">
                    {onEdit && (
                      <button className="icon-button row-action" aria-label={`Edit ${application.companyName}`} onClick={() => onEdit(application)}>
                        <Icon name="edit" size={17} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="icon-button row-action delete-action"
                        aria-label={`Delete ${application.companyName}`}
                        onClick={() => onDelete(application)}
                        disabled={deletingId === application.id}
                      >
                        <Icon name="trash" size={17} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-footer">
        <span>Showing <strong>{applications.length}</strong> of <strong>{totalCount}</strong> applications</span>
        <span className="table-footer-note"><span className="live-dot" /> Synced with your tracker</span>
      </div>
    </div>
  )
}
