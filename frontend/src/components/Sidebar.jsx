import Icon from './Icon.jsx'
import ProfileMenu from './ProfileMenu.jsx'

const navigation = [
  { id: 'dashboard', label: 'Overview', icon: 'grid' },
  { id: 'applications', label: 'Applications', icon: 'briefcase' },
  { id: 'interviews', label: 'Interviews', icon: 'chart' },
]

export default function Sidebar({ activePage, applicationCount, activeCount, onNavigate, user, onSignOut }) {
  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => onNavigate('dashboard')} aria-label="Applywise home">
        <span className="brand-mark"><Icon name="spark" size={22} /></span>
        <span>applywise<span className="brand-period">.</span></span>
      </button>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <button
            key={item.id}
            className={`nav-link ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            aria-current={activePage === item.id ? 'page' : undefined}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
            {item.id === 'applications' && <span className="nav-count">{applicationCount}</span>}
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-tip">
          <div className="tip-icon"><Icon name="spark" size={17} /></div>
          <p className="tip-title">Keep your momentum</p>
          <p className="tip-copy">A little progress each day adds up to big results.</p>
          <div className="tip-progress"><span style={{ width: `${Math.min(activeCount * 12, 100)}%` }} /></div>
          <span className="tip-caption">{activeCount} active {activeCount === 1 ? 'application' : 'applications'}</span>
        </div>
        <ProfileMenu variant="sidebar" user={user} onNavigate={onNavigate} onSignOut={onSignOut} />
      </div>
    </aside>
  )
}
