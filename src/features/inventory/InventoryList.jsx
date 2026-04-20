import { memo, useCallback, useMemo, useState } from 'react'
import { useInventory } from '../../context/InventoryContext'
import InventoryEditDrawer from './InventoryEditDrawer'
import ItemForm from './ItemForm'

function formatTimestamp(timestamp) {
  if (!timestamp) {
    return '-'
  }

  if (timestamp instanceof Date) {
    return Number.isNaN(timestamp.getTime()) ? '-' : timestamp.toLocaleString()
  }

  if (timestamp?.toDate) {
    return timestamp.toDate().toLocaleString()
  }

  if (typeof timestamp === 'number') {
    const parsedFromNumber = new Date(timestamp)
    return Number.isNaN(parsedFromNumber.getTime()) ? '-' : parsedFromNumber.toLocaleString()
  }

  if (timestamp?.seconds !== undefined && timestamp?.nanoseconds !== undefined) {
    const parsedFromSeconds = new Date(
      Number(timestamp.seconds) * 1000 + Number(timestamp.nanoseconds) / 1_000_000,
    )
    return Number.isNaN(parsedFromSeconds.getTime()) ? '-' : parsedFromSeconds.toLocaleString()
  }

  const parsed = new Date(timestamp)
  return Number.isNaN(parsed.getTime()) ? '-' : parsed.toLocaleString()
}

function toTimestampValue(timestamp) {
  if (!timestamp) {
    return ''
  }

  if (timestamp?.toMillis) {
    return String(timestamp.toMillis())
  }

  if (timestamp instanceof Date) {
    return String(timestamp.getTime())
  }

  if (typeof timestamp === 'number') {
    return String(timestamp)
  }

  if (timestamp?.seconds !== undefined && timestamp?.nanoseconds !== undefined) {
    return `${timestamp.seconds}-${timestamp.nanoseconds}`
  }

  return String(timestamp)
}

const InventoryTableRow = memo(
  function InventoryTableRow({ item, onEdit }) {
    const isLowStock = item.quantity <= item.minThreshold

    return (
      <tr className="border-b border-slate-100 last:border-b-0 dark:border-slate-800">
        <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{item.name}</td>
        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.category}</td>
        <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{item.quantity}</td>
        <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{item.minThreshold}</td>
        <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
          ₹{Number(item.price).toFixed(2)}
        </td>
        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatTimestamp(item.timestamp)}</td>
        <td className="px-4 py-3">
          <span
            className={
              isLowStock
                ? 'inline-flex animate-pulse rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900/50 dark:text-red-200'
                : 'inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
            }
          >
            {isLowStock ? 'Low Stock' : 'In Stock'}
          </span>
        </td>
        <td className="px-4 py-3">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Edit
          </button>
        </td>
      </tr>
    )
  },
  (prevProps, nextProps) =>
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.name === nextProps.item.name &&
    prevProps.item.category === nextProps.item.category &&
    prevProps.item.quantity === nextProps.item.quantity &&
    prevProps.item.minThreshold === nextProps.item.minThreshold &&
    prevProps.item.price === nextProps.item.price &&
    toTimestampValue(prevProps.item.timestamp) === toTimestampValue(nextProps.item.timestamp),
)

function InventoryTableSkeleton() {
  return (
    <div className="max-h-[70vh] overflow-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800">
            {['Name', 'Category', 'Quantity', 'Min', 'Price', 'Updated', 'Status', 'Actions'].map(
              (label) => (
                <th
                  key={label}
                  className="sticky top-0 z-10 bg-white px-4 py-3 font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  {label}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, index) => (
            <tr key={index} className="border-b border-slate-100 last:border-b-0 dark:border-slate-800">
              {Array.from({ length: 8 }).map((__, cellIndex) => (
                <td key={`${index}-${cellIndex}`} className="px-4 py-3">
                  <div className="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function InventoryList() {
  const { items, loading, error, updateItem } = useInventory()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [activeItem, setActiveItem] = useState(null)
  const handleEdit = useCallback((item) => setActiveItem(item), [])

  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category).filter(Boolean))).sort(),
    [items],
  )

  const matchesFilters = useCallback(
    (item) => {
      const normalizedSearch = searchTerm.trim().toLowerCase()
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch)

      const matchesCategory =
        categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase()

      return matchesSearch && matchesCategory
    },
    [searchTerm, categoryFilter],
  )

  const filteredItems = useMemo(() => items.filter(matchesFilters), [items, matchesFilters])

  if (error) {
    return (
      <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
        Could not load inventory. Check Firestore rules and config.
      </p>
    )
  }

  return (
    <section className="space-y-4">
      <ItemForm />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Inventory</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {loading ? 'Loading inventory...' : `Showing ${filteredItems.length} of ${items.length} items`}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by name or category"
          className="w-full max-w-sm rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-slate-900/10 placeholder:text-slate-400 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:ring-slate-100/10"
        />
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-slate-900/10 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-100/10"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <InventoryTableSkeleton />
      ) : (
        <div className="max-h-[70vh] overflow-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                {['Name', 'Category', 'Quantity', 'Min', 'Price', 'Updated', 'Status', 'Actions'].map(
                  (label) => (
                    <th
                      key={label}
                      className="sticky top-0 z-10 bg-white px-4 py-3 font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      {label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                    No inventory items found for this filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <InventoryTableRow key={item.id} item={item} onEdit={handleEdit} />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <InventoryEditDrawer
        item={activeItem}
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        onSave={updateItem}
      />
    </section>
  )
}

export default InventoryList
