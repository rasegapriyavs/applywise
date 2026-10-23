import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Sidebar from './components/Sidebar.jsx'
import useApplications from './hooks/useApplications.js'
import { useAuth } from './context/AuthContext.jsx'
import Applications from './pages/Applications.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Interviews from './pages/Interviews.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import Register from './pages/Register.jsx'

const PAGE_TITLES = {
  dashboard: 'Overview',
  applications: 'Applications',
  interviews: 'Interviews',
  profile: 'My Profile',
}

function AuthenticatedApplication({ user }) {
  const [activePage, setActivePage] = useState('dashboard')
  const [profileSection, setProfileSection] = useState('profile')
  const [createRequest, setCreateRequest] = useState(0)
  const {
    applications,
    loading,
    error,
    actionError,
    reload,
    createApplication,
    updateApplication,
    deleteApplication,
  } = useApplications()
  const { logout, updateProfile, changePassword } = useAuth()

  function openNewApplication() {
    setActivePage('applications')
    setCreateRequest((request) => request + 1)
  }

  function saveApplication(application, payload) {
    return application
      ? updateApplication(application.id, payload)
      : createApplication(payload)
  }

  function navigateToProfile(page, section = 'profile') {
    setProfileSection(section)
    setActivePage(page)
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        applicationCount={applications.length}
        activeCount={applications.filter((item) =>
          ['Applied', 'Assessment', 'Interview'].includes(item.status),
        ).length}
        onNavigate={setActivePage}
        user={user}
        onSignOut={logout}
      />
      <main className="main-content">
        <Navbar
          title={PAGE_TITLES[activePage]}
          user={user}
          onProfile={navigateToProfile}
          onSignOut={logout}
        />
        {activePage === 'dashboard' && (
          <Dashboard
            applications={applications}
            loading={loading}
            error={error}
            onRetry={reload}
            onAdd={openNewApplication}
            onNavigate={setActivePage}
          />
        )}
        {activePage === 'applications' && (
          <Applications
            applications={applications}
            loading={loading}
            error={error}
            actionError={actionError}
            createRequest={createRequest}
            onRetry={reload}
            onSave={saveApplication}
            onDelete={deleteApplication}
          />
        )}
        {activePage === 'interviews' && (
          <Interviews
            applications={applications}
            loading={loading}
            error={error}
            actionError={actionError}
            onRetry={reload}
            onSave={saveApplication}
            onDelete={deleteApplication}
          />
        )}
        {activePage === 'profile' && (
          <Profile
            user={user}
            initialSection={profileSection}
            onUpdate={updateProfile}
            onChangePassword={changePassword}
          />
        )}
      </main>
    </div>
  )
}

function AuthenticationPage({ initialError }) {
  const { login, register } = useAuth()
  const [page, setPage] = useState('login')

  if (page === 'register') {
    return <Register onRegister={register} onLogin={() => setPage('login')} initialError={initialError} />
  }
  return <Login onLogin={login} onRegister={() => setPage('register')} initialError={initialError} />
}

export default function App() {
  const { user, initializing, authError } = useAuth()

  if (initializing) {
    return <div className="auth-loading" role="status"><span className="spinner" />Preparing your secure workspace…</div>
  }

  return (
    <ProtectedRoute
      user={user}
      fallback={<AuthenticationPage initialError={authError} />}
    >
      <AuthenticatedApplication user={user} />
    </ProtectedRoute>
  )
}
