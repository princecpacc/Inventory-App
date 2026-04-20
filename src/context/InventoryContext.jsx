import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  addItem,
  deleteItem,
  getItems,
  updateItem,
} from '../services/inventoryService'

const InventoryContext = createContext(null)
const starterItems = [
  { name: 'Milk 1L', category: 'Dairy', quantity: 24, minThreshold: 8, price: 2.49 },
  { name: 'Bread Loaf', category: 'Bakery', quantity: 18, minThreshold: 6, price: 1.99 },
  { name: 'Eggs (12 pack)', category: 'Dairy', quantity: 30, minThreshold: 10, price: 3.75 },
  { name: 'Apples', category: 'Produce', quantity: 42, minThreshold: 15, price: 0.65 },
  { name: 'Pasta 500g', category: 'Pantry', quantity: 27, minThreshold: 9, price: 1.35 },
]

export function InventoryProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const hasSeededRef = useRef(false)

  useEffect(() => {
    const unsubscribe = getItems(
      (nextItems) => {
        setItems(nextItems)
        setLoading(false)
        setError(null)
      },
      (listenerError) => {
        setError(listenerError)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  const lowStockItems = useMemo(
    () => items.filter((item) => item.quantity <= item.minThreshold),
    [items],
  )

  const totalInventoryValue = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items],
  )

  const createItem = useCallback(async (item) => addItem(item), [])
  const editItem = useCallback(
    async (itemId, updates) => {
      let previousItems = []

      // Optimistic update: reflect edits immediately in UI.
      setItems((currentItems) => {
        previousItems = currentItems
        return currentItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                ...updates,
                quantity:
                  updates.quantity !== undefined ? Number(updates.quantity) : Number(item.quantity),
                minThreshold:
                  updates.minThreshold !== undefined
                    ? Number(updates.minThreshold)
                    : Number(item.minThreshold),
                price: updates.price !== undefined ? Number(updates.price) : Number(item.price),
                timestamp: new Date(),
              }
            : item,
        )
      })

      try {
        await updateItem(itemId, updates)
      } catch (updateError) {
        // Roll back if backend update fails.
        setItems(previousItems)
        throw updateError
      }
    },
    [setItems],
  )
  const removeItem = useCallback(async (itemId) => deleteItem(itemId), [])

  useEffect(() => {
    if (loading || error || items.length > 0 || hasSeededRef.current) {
      return
    }

    hasSeededRef.current = true
    Promise.all(starterItems.map((item) => createItem(item))).catch(() => {
      hasSeededRef.current = false
    })
  }, [loading, error, items.length, createItem])

  const value = useMemo(
    () => ({
      items,
      loading,
      error,
      lowStockItems,
      totalInventoryValue,
      addItem: createItem,
      updateItem: editItem,
      deleteItem: removeItem,
    }),
    [
      items,
      loading,
      error,
      lowStockItems,
      totalInventoryValue,
      createItem,
      editItem,
      removeItem,
    ],
  )

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const context = useContext(InventoryContext)

  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider')
  }

  return context
}
