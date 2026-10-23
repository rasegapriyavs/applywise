import { useState } from 'react'
import Icon from '../components/Icon.jsx'

export default function Login({ onLogin, onRegister, initialError = '' }) {
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
      await onLogin({ email: email.trim(), password })
    } catch (loginError) {
      setError(loginError.message || 'Sign in failed.')
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
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Pick up where <span>you left off.</span></h1>
        <p className="auth-intro">Sign in to keep your job search moving.</p>
        <form className="auth-form" onSubmit={submit}>
          <label>Email address
            <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required maxLength={254} placeholder="you@example.com" />
          </label>
          <label>Password
            <span className="password-field">
              <input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </span>
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="button button-primary auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'} {!submitting && <Icon name="arrow" size={17} />}
          </button>
        </form>
        <p className="auth-switch">New to Applywise? <button type="button" onClick={onRegister}>Create an account</button></p>
      </section>
    </main>
  )
}
