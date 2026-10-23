import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'

const menuItems = [
  { id: 'profile', label: 'My Profile' },
  { id: 'settings', label: 'Account Settings' },
  { id: 'signout', label: 'Sign Out', danger: true },
]

function getInitials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'PS'
}

export default function ProfileMenu({ variant = 'navbar', user, onNavigate, onSignOut }) {
  const menuRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [signOutError, setSignOutError] = useState('')
  const [signingOut, setSigningOut] = useState(false)
  const initials = getInitials(user?.fullName)

  useEffect(() => {
    if (!isOpen && !signOutError) return undefined

    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        setSignOutError('')
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, signOutError])

  async function selectItem(item) {
    setIsOpen(false)
    setSignOutError('')
    if (item.id === 'profile') {
      onNavigate?.('profile', 'profile')
      return
    }
    if (item.id === 'settings') {
      onNavigate?.('profile', 'settings')
      return
    }
    setSigningOut(true)
    try {
      await onSignOut()
    } catch (error) {
      setSignOutError(error.message || 'Sign out failed. You are still signed in.')
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className={`profile-menu-root profile-menu-${variant}`} ref={menuRef}>
      {variant === 'sidebar' ? (
        <button
          className="profile profile-trigger"
          type="button"
          aria-label="Open workspace profile menu"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          disabled={signingOut}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="profile-avatar">{initials}</span>
          <span className="profile-text"><strong>{user?.fullName || 'Your workspace'}</strong><span>{user?.email || 'Personal tracker'}</span></span>
          <span className="icon-button profile-menu"><Icon name="dots" /></span>
        </button>
      ) : (
        <button
          className="topbar-avatar profile-avatar-trigger"
          type="button"
          aria-label="Open profile menu"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          disabled={signingOut}
          onClick={() => setIsOpen((open) => !open)}
        >
          {initials}
        </button>
      )}

      {isOpen && (
        <div className="profile-dropdown" role="menu" aria-label="Profile options">
          <div className="profile-dropdown-heading">
            <span className="profile-avatar">{initials}</span>
            <span className="profile-text"><strong>{user?.fullName || 'Your workspace'}</strong><span>{user?.email || 'Personal tracker'}</span></span>
          </div>
          <div className="profile-dropdown-divider" />
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`profile-dropdown-item ${item.danger ? 'profile-dropdown-danger' : ''}`}
              type="button"
              role="menuitem"
              disabled={signingOut}
              onClick={() => selectItem(item)}
            >
              {signingOut && item.id === 'signout' ? 'Signing out…' : item.label}
            </button>
          ))}
        </div>
      )}

      {signOutError && <div className="profile-menu-error" role="alert">{signOutError}</div>}
    </div>
  )
}
