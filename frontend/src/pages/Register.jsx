import { useState } from 'react'
import Icon from '../components/Icon.jsx'

export default function Register({ onRegister, onLogin, initialError = '' }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(initialError)
  const [submitting, setSubmitting] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await onRegister({ fullName: fullName.trim(), email: email.trim(), password })
    } catch (registerError) {
      setError(registerError.message || 'Could not create your account.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <a href="#" className="brand auth-brand" aria-label="Applywise">
          <span className="brand-mark"><Icon name="spark" size={22} /></span>
          <span>applywise<span className="brand-period">.</span></span>
        </a>
        <span className="eyebrow">YOUR NEXT CHAPTER</span>
        <h1>Make room for <span>what's next.</span></h1>
        <p className="auth-intro">Create an account to keep your opportunities in one place.</p>
        <form className="auth-form" onSubmit={submit}>
          <label>Full name
            <input autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} required maxLength={120} />
          </label>
          <label>Email address
            <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} placeholder="you@example.com" />
          </label>
          <label>Password
            <span className="password-field">
              <input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={12} maxLength={72} />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </span>
          </label>
          <span className="auth-hint">Use at least 12 characters (maximum 72 UTF-8 bytes).</span>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="button button-primary auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'} {!submitting && <Icon name="arrow" size={17} />}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <button type="button" onClick={onLogin}>Sign in</button></p>
      </section>
    </main>
  )
}
