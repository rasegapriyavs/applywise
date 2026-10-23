import Icon from './Icon.jsx'

export default function StatCard({ label, value, detail, icon, color, trend }) {
  return (
    <article className="stat-card">
      <div className="stat-topline">
        <span className="stat-label">{label}</span>
        <span className={`stat-icon stat-icon-${color}`}><Icon name={icon} size={18} /></span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-foot">
        {trend && <span className="stat-foot-icon"><Icon name="trend" size={15} /></span>}
        <span>{detail}</span>
      </div>
    </article>
  )
}
