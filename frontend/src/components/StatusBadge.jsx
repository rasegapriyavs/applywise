export default function StatusBadge({ status }) {
  const normalizedStatus = status || 'Applied'
  return (
    <span className={`status-badge status-${normalizedStatus.toLowerCase()}`}>
      {normalizedStatus}
    </span>
  )
}
