import { createElement } from 'react'
import { Boxes, LayoutDashboard, ShieldCheck, BarChart2 } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Inventory', icon: Boxes, to: '/inventory' },
  { label: 'Analytics', icon: BarChart2, to: '/analytics' },
  { label: 'Auth', icon: ShieldCheck, to: '/auth' },
]

function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="w-72 border-r border-slate-200 bg-white p-5 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <h1 className="mb-6 text-lg font-semibold">Inventory App</h1>
      <nav className="flex flex-col gap-2">
        {navItems.map(({ label, icon, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100',
              )
            }
          >
            {createElement(icon, { size: 18 })}
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
        <ThemeToggle />
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
          {user?.email ?? 'Signed in user'}
        </p>
        <button
          type="button"
          onClick={logout}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
