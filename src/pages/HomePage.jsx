import { Link } from 'react-router-dom'
import { useInventory } from '../context/InventoryContext'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)
}

function HomePage() {
  const { items, lowStockItems, totalInventoryValue, loading } = useInventory()

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Dashboard</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Quick overview of your inventory and direct access to the item form page.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total items</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {loading ? '--' : items.length}
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Low stock alerts</p>
          <p className="mt-1 text-2xl font-semibold text-red-600">
            {loading ? '--' : lowStockItems.length}
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Inventory value</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-700">
            {loading ? '--' : formatCurrency(totalInventoryValue)}
          </p>
        </article>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Manage inventory</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Add new items, search stock, and edit records from the inventory screen.
        </p>
        <Link
          to="/inventory"
          className="mt-4 inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Go to Inventory Form
        </Link>
      </div>
    </section>
  )
}

export default HomePage
