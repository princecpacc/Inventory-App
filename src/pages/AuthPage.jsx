import { sendPasswordResetEmail } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { auth } from '../services/config'

function formatLastSignIn(dateString) {
  if (!dateString) {
    return 'Unavailable'
  }

  const parsed = new Date(dateString)
  if (Number.isNaN(parsed.getTime())) {
    return 'Unavailable'
  }

  return parsed.toLocaleString()
}

function AuthPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [resetMessage, setResetMessage] = useState('')
  const [resetError, setResetError] = useState('')
  const [sendingReset, setSendingReset] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const handleResetPassword = async () => {
    if (!user?.email) {
      setResetError('No email is available for this account.')
      setResetMessage('')
      return
    }

    setResetError('')
    setResetMessage('')
    setSendingReset(true)
    try {
      await sendPasswordResetEmail(auth, user.email)
      setResetMessage(`Password reset email sent to ${user.email}.`)
    } catch {
      setResetError('Could not send reset email right now. Please try again.')
    } finally {
      setSendingReset(false)
    }
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await logout()
      navigate('/login', { replace: true })
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Authentication</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Manage your account session and security actions.
        </p>
      </div>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Current session</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Email</dt>
            <dd className="font-medium text-slate-800 dark:text-slate-200">{user?.email ?? 'Unavailable'}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Last sign in</dt>
            <dd className="font-medium text-slate-800 dark:text-slate-200">
              {formatLastSignIn(user?.metadata?.lastSignInTime)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400">Email verified</dt>
            <dd className="font-medium text-slate-800 dark:text-slate-200">
              {user?.emailVerified ? 'Yes' : 'No'}
            </dd>
          </div>
        </dl>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Security actions</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Send a password reset email or sign out from this device.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={sendingReset}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {sendingReset ? 'Sending reset email...' : 'Send password reset'}
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {signingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>

        {resetMessage ? (
          <p className="mt-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            {resetMessage}
          </p>
        ) : null}

        {resetError ? (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
            {resetError}
          </p>
        ) : null}
      </article>
    </section>
  )
}

export default AuthPage
