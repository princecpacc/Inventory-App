import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from './config'

const inventoryCollection = collection(db, 'inventory')

const toInventoryItem = (docSnapshot) => {
  const data = docSnapshot.data()

  return {
    id: docSnapshot.id,
    name: data.name ?? '',
    category: data.category ?? '',
    quantity: Number(data.quantity ?? 0),
    minThreshold: Number(data.minThreshold ?? 0),
    price: Number(data.price ?? 0),
    timestamp: data.timestamp ?? null,
  }
}

export function getItems(onChange, onError) {
  const q = query(inventoryCollection, orderBy('timestamp', 'desc'))

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map(toInventoryItem)
      onChange(items)
    },
    onError,
  )
}

export async function addItem(item) {
  const payload = {
    name: item.name ?? '',
    category: item.category ?? '',
    quantity: Number(item.quantity ?? 0),
    minThreshold: Number(item.minThreshold ?? 0),
    price: Number(item.price ?? 0),
    timestamp: serverTimestamp(),
  }

  return addDoc(inventoryCollection, payload)
}

export async function updateItem(itemId, updates) {
  const itemRef = doc(db, 'inventory', itemId)
  const payload = {
    ...updates,
    quantity: updates.quantity !== undefined ? Number(updates.quantity) : undefined,
    minThreshold:
      updates.minThreshold !== undefined ? Number(updates.minThreshold) : undefined,
    price: updates.price !== undefined ? Number(updates.price) : undefined,
    timestamp: serverTimestamp(),
  }

  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key]
    }
  })

  return updateDoc(itemRef, payload)
}

export async function deleteItem(itemId) {
  const itemRef = doc(db, 'inventory', itemId)
  return deleteDoc(itemRef)
}
