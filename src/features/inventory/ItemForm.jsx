import { useEffect, useMemo, useState } from 'react'
import { useInventory } from '../../context/InventoryContext'

const initialForm = {
  name: '',
  category: '',
  quantity: '0',
  minThreshold: '0',
  price: '0',
}

function normalizeNumericInput(value) {
  if (value === '') {
    return ''
  }

  const parsed = Number(value)
  return Number.isNaN(parsed) ? '' : String(parsed)
}

function ItemForm() {
  const { addItem } = useInventory()
  const [formState, setFormState] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!showToast) {
      return undefined
    }

    const timeoutId = setTimeout(() => setShowToast(false), 2500)
    return () => clearTimeout(timeoutId)
  }, [showToast])

  const parsedValues = useMemo(
    () => ({
      quantity: Number(formState.quantity),
      minThreshold: Number(formState.minThreshold),
      price: Number(formState.price),
    }),
    [formState],
  )

  const validate = () => {
    const nextErrors = {}

    if (formState.name.trim().length === 0) {
      nextErrors.name = 'Item name is required.'
    }

    if (formState.category.trim().length === 0) {
      nextErrors.category = 'Category is required.'
    }

    if (Number.isNaN(parsedValues.quantity) || parsedValues.quantity < 0) {
      nextErrors.quantity = 'Quantity cannot be negative.'
    }

    if (Number.isNaN(parsedValues.minThreshold) || parsedValues.minThreshold < 0) {
      nextErrors.minThreshold = 'Min threshold cannot be negative.'
    }

    if (Number.isNaN(parsedValues.price) || parsedValues.price < 0) {
      nextErrors.price = 'Price cannot be negative.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value, type } = event.target
    const nextValue = type === 'number' ? normalizeNumericInput(value) : value
    setFormState((prev) => ({ ...prev, [name]: nextValue }))

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
    setSubmitError('')

    if (!validate()) {
      return
    }

    const payload = {
      name: formState.name.trim(),
      category: formState.category.trim(),
      quantity: parsedValues.quantity,
      minThreshold: parsedValues.minThreshold,
      price: parsedValues.price,
    }

    setSubmitting(true)
    try {
      await addItem(payload)
      setFormState(initialForm)
      setErrors({})
      setShowToast(true)
    } catch {
      setSubmitError('Unable to add item right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Add Item</h2>
        {showToast ? (
          <p className="rounded-md bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
            Item added successfully.
          </p>
        ) : null}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Name
            <input
              name="name"
              value={formState.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-slate-900/10 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-100/10"
              required
            />
            {errors.name ? <span className="mt-1 block text-xs text-red-600">{errors.name}</span> : null}
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
            {errors.category ? (
              <span className="mt-1 block text-xs text-red-600">{errors.category}</span>
            ) : null}
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
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
            {errors.quantity ? (
              <span className="mt-1 block text-xs text-red-600">{errors.quantity}</span>
            ) : null}
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
            {errors.minThreshold ? (
              <span className="mt-1 block text-xs text-red-600">{errors.minThreshold}</span>
            ) : null}
          </label>

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
            {errors.price ? <span className="mt-1 block text-xs text-red-600">{errors.price}</span> : null}
          </label>
        </div>

        {submitError ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
            {submitError}
          </p>
        ) : null}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default ItemForm
