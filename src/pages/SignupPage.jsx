import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function SignupPage() {
  const { isAuthenticated, register } = useAuth()
  const navigate = useNavigate()

  const [formState, setFormState] = useState({ email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [authError, setAuthError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/inventory" replace />
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

    if (!formState.confirm) {
      nextErrors.confirm = 'Please confirm your password.'
    } else if (formState.confirm !== formState.password) {
      nextErrors.confirm = 'Passwords do not match.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setAuthError('')

    if (!validate()) return

    setSubmitting(true)
    try {
      await register(formState.email.trim(), formState.password)
      navigate('/inventory', { replace: true })
    } catch (err) {
      if (err?.code === 'auth/email-already-in-use') {
        setAuthError('An account with this email already exists.')
      } else {
        setAuthError('Sign-up failed. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto mt-16 max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Create an account</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Sign up to start managing your inventory.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email
          <input
            id="signup-email"
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
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={formState.password}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-slate-900/10 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-100/10"
            required
          />
          {errors.password ? <span className="mt-1 block text-xs text-red-600">{errors.password}</span> : null}
        </label>

        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Confirm Password
          <input
            id="signup-confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            value={formState.confirm}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-slate-900/10 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-100/10"
            required
          />
          {errors.confirm ? <span className="mt-1 block text-xs text-red-600">{errors.confirm}</span> : null}
        </label>

        {authError ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
            {authError}
          </p>
        ) : null}

        <button
          id="signup-submit"
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-slate-700 underline dark:text-slate-200">
          Sign in
        </Link>
      </p>
    </section>
  )
}

export default SignupPage
