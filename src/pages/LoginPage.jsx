import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [formState, setFormState] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [authError, setAuthError] = useState('')

  const from = location.state?.from?.pathname ?? '/inventory'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const validate = () => {
    const nextErrors = {}

    if (!formState.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!formState.password) {
      nextErrors.password = 'Password is required.'
    } else if (formState.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))

    setErrors((prev) => {
      if (!prev[name]) {
        return prev
      }
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setAuthError('')

    if (!validate()) {
      return
    }

    setSubmitting(true)
    try {
      await login(formState.email.trim(), formState.password)
      navigate(from, { replace: true })
    } catch {
      setAuthError('Sign-in failed. Check your email/password and Firebase auth settings.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto mt-16 max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Login</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Sign in to access your inventory dashboard and form page.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            value={formState.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-slate-900/10 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-100/10"
            required
          />
          {errors.email ? <span className="mt-1 block text-xs text-red-600">{errors.email}</span> : null}
        </label>

        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            value={formState.password}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-slate-900/10 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-100/10"
            required
          />
          {errors.password ? (
            <span className="mt-1 block text-xs text-red-600">{errors.password}</span>
          ) : null}
        </label>

        {authError ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
            {authError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        After login, you will be redirected to your requested page. Try going straight to{' '}
        <Link to="/inventory" className="font-medium text-slate-700 underline dark:text-slate-200">
          inventory
        </Link>
        .
      </p>
    </section>
  )
}

export default LoginPage
