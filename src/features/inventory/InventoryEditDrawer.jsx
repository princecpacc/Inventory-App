import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const emptyForm = {
  name: '',
  category: '',
  quantity: 0,
  minThreshold: 0,
  price: 0,
}

function normalizeNumericInput(value) {
  if (value === '') {
    return ''
  }

  const parsed = Number(value)
  return Number.isNaN(parsed) ? '' : parsed
}

function InventoryEditDrawer({ item, isOpen, onClose, onSave }) {
  const [formState, setFormState] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!item) {
      setFormState(emptyForm)
      return
    }

    setFormState({
      name: item.name ?? '',
      category: item.category ?? '',
      quantity: item.quantity ?? 0,
      minThreshold: item.minThreshold ?? 0,
      price: item.price ?? 0,
    })
  }, [item])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  const handleChange = (event) => {
    const { name, value, type } = event.target
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'number' ? normalizeNumericInput(value) : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!item) {
      return
    }

    setSubmitting(true)
    // Close immediately for responsive UX; save continues in background.
    onClose()
    Promise.resolve(onSave(item.id, formState)).finally(() => {
      setSubmitting(false)
    })
  }

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close edit drawer overlay"
        className="absolute inset-0 bg-slate-900/30"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Edit Item</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Update inventory values and save changes.
        </p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Name
            <input
              name="name"
              value={formState.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-slate-900/10 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-100/10"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Category
            <input
              name="category"
              value={formState.category}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-slate-900/10 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-100/10"
              required
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Quantity
              <input
                name="quantity"
                type="number"
                min="0"
                value={formState.quantity}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-slate-900/10 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-100/10"
                required
              />
            </label>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Min Threshold
              <input
                name="minThreshold"
                type="number"
                min="0"
                value={formState.minThreshold}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-slate-900/10 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-100/10"
                required
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Price
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formState.price}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-slate-900/10 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-100/10"
              required
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </aside>
    </div>,
    document.body,
  )
}

export default InventoryEditDrawer
