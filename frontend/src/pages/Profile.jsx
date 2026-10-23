import { useEffect, useState } from 'react'
import Icon from '../components/Icon.jsx'

export default function Profile({ user, initialSection = 'profile', onUpdate, onChangePassword }) {
  const [fullName, setFullName] = useState(user.fullName)
  const [email, setEmail] = useState(user.email)
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)

  useEffect(() => {
    setFullName(user.fullName)
    setEmail(user.email)
  }, [user])

  async function saveProfile(event) {
    event.preventDefault()
    setProfileSaving(true)
    setProfileError('')
    setProfileMessage('')
    try {
      const updated = await onUpdate({ fullName: fullName.trim(), email: email.trim() })
      setFullName(updated.fullName)
      setEmail(updated.email)
      setProfileMessage('Your profile has been updated.')
    } catch (error) {
      setProfileError(error.message || 'Could not update your profile.')
    } finally {
      setProfileSaving(false)
    }
  }

  async function changePassword(event) {
    event.preventDefault()
    setPasswordError('')
    setPasswordMessage('')
    if (newPassword !== confirmPassword) {
      setPasswordError('The new password and confirmation do not match.')
      return
    }
    setPasswordSaving(true)
    try {
      await onChangePassword({ currentPassword, newPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordMessage('Password changed. Your current session remains active.')
    } catch (error) {
      setPasswordError(error.message || 'Could not change your password.')
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <div className="page-content profile-page">
      <section className="welcome-row">
        <div>
          <div className="eyebrow welcome-eyebrow">YOUR ACCOUNT</div>
          <h1>Your profile <span>&amp settings.</span></h1>
          <p className="welcome-copy">Manage your account details and sign-in security.</p>
        </div>
      </section>

      <section className="profile-content-grid">
        <article className="profile-summary-card">
          <div className="profile-summary-avatar">{user.fullName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}</div>
          <h2>{user.fullName}</h2>
          <p>{user.email}</p>
          <span className="profile-member-label">APPLYWISE MEMBER</span>
        </article>

        <div className="profile-forms">
          <section className={`profile-form-card ${initialSection === 'settings' ? 'profile-form-highlight' : ''}`}>
            <div className="profile-section-heading">
              <span className="profile-section-icon"><Icon name="edit" size={17} /></span>
              <div><h2>Profile details</h2><p>Update the name and email associated with your account.</p></div>
            </div>
            <form className="auth-form profile-form" onSubmit={saveProfile}>
              <label>Full name
                <input autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required maxLength={120} />
              </label>
              <label>Email address
                <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} />
              </label>
              {profileError && <p className="auth-error" role="alert">{profileError}</p>}
              {profileMessage && <p className="auth-success" role="status">{profileMessage}</p>}
              <button className="button button-primary profile-submit" type="submit" disabled={profileSaving}>
                {profileSaving ? 'Saving…' : 'Save profile'}
              </button>
            </form>
          </section>

          <section className="profile-form-card">
            <div className="profile-section-heading">
              <span className="profile-section-icon profile-lock-icon"><Icon name="check" size={17} /></span>
              <div><h2>Change password</h2><p>Confirm your current password before choosing a new one.</p></div>
            </div>
            <form className="auth-form profile-form" onSubmit={changePassword}>
              <label>Current password
                <input type={showPasswords ? 'text' : 'password'} autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
              </label>
              <label>New password
                <input type={showPasswords ? 'text' : 'password'} autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required minLength={12} maxLength={72} />
              </label>
              <label>Confirm new password
                <input type={showPasswords ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={12} maxLength={72} />
              </label>
              <label className="show-password-option">
                <input type="checkbox" checked={showPasswords} onChange={(event) => setShowPasswords(event.target.checked)} />
                Show passwords
              </label>
              <span className="auth-hint">Use at least 12 characters (maximum 72 UTF-8 bytes).</span>
              {passwordError && <p className="auth-error" role="alert">{passwordError}</p>}
              {passwordMessage && <p className="auth-success" role="status">{passwordMessage}</p>}
              <button className="button button-primary profile-submit" type="submit" disabled={passwordSaving}>
                {passwordSaving ? 'Changing…' : 'Update password'}
              </button>
            </form>
          </section>
        </div>
      </section>
    </div>
  )
}
