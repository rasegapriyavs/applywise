import Icon from './Icon.jsx'
import ProfileMenu from './ProfileMenu.jsx'

export default function Navbar({ title, user, onProfile, onSignOut }) {
  return (
    <header className="topbar">
      <div className="breadcrumb">Workspace <span>/</span> <strong>{title}</strong></div>
      <div className="topbar-actions">
        <span className="today-label">
          {new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date())}
        </span>
        <span className="topbar-divider" />
        <button className="icon-button notification-button" aria-label="Notifications"><Icon name="bell" /></button>
        <ProfileMenu variant="navbar" user={user} onNavigate={onProfile} onSignOut={onSignOut} />
      </div>
    </header>
  )
}
