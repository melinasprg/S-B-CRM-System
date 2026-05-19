import initialData from '../../db.json'

export type Customer = { id: number; name: string; email?: string; phone?: string; company?: string; address?: string; materials?: number[] }
export type Supplier = { id: number; name: string; contact?: string; phone?: string; company?: string; address?: string; materials?: number[] }
export type Material = { id: number; name: string; quantity: number; price?: number; description?: string }

type Data = {
  customers: Customer[]
  suppliers: Supplier[]
  materials: Material[]
}

const STORAGE_KEY = 'my-crm-data'
const seedData = initialData as Data

function loadData(): Data {
  if (typeof window === 'undefined') {
    return JSON.parse(JSON.stringify(seedData))
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored) as Data
    } catch {
      // fall through to reset data
    }
  }

  const initial = JSON.parse(JSON.stringify(seedData))
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
  return initial
}

function saveData(data: Data) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

function nextId(items: { id: number }[]) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

export async function getCustomers() {
  return loadData().customers
}

export async function getSuppliers() {
  return loadData().suppliers
}

export async function getMaterials() {
  return loadData().materials
}

export async function createCustomer(payload: Omit<Customer, 'id'>) {
  const data = loadData()
  const created = { id: nextId(data.customers), ...payload }
  data.customers = [created, ...data.customers]
  saveData(data)
  return created
}

export async function updateCustomer(id: number, payload: Omit<Customer, 'id'>) {
  const data = loadData()
  data.customers = data.customers.map((item) => (item.id === id ? { id, ...payload } : item))
  saveData(data)
  return data.customers.find((item) => item.id === id)!
}

export async function deleteCustomer(id: number) {
  const data = loadData()
  data.customers = data.customers.filter((item) => item.id !== id)
  saveData(data)
}

export async function createSupplier(payload: Omit<Supplier, 'id'>) {
  const data = loadData()
  const created = { id: nextId(data.suppliers), ...payload }
  data.suppliers = [created, ...data.suppliers]
  saveData(data)
  return created
}

export async function updateSupplier(id: number, payload: Omit<Supplier, 'id'>) {
  const data = loadData()
  data.suppliers = data.suppliers.map((item) => (item.id === id ? { id, ...payload } : item))
  saveData(data)
  return data.suppliers.find((item) => item.id === id)!
}

export async function deleteSupplier(id: number) {
  const data = loadData()
  data.suppliers = data.suppliers.filter((item) => item.id !== id)
  saveData(data)
}

export async function createMaterial(payload: Omit<Material, 'id'>) {
  const data = loadData()
  const created = { id: nextId(data.materials), ...payload }
  data.materials = [created, ...data.materials]
  saveData(data)
  return created
}

export async function updateMaterial(id: number, payload: Omit<Material, 'id'>) {
  const data = loadData()
  data.materials = data.materials.map((item) => (item.id === id ? { id, ...payload } : item))
  saveData(data)
  return data.materials.find((item) => item.id === id)!
}

export async function deleteMaterial(id: number) {
  const data = loadData()
  data.materials = data.materials.filter((item) => item.id !== id)
  data.suppliers = data.suppliers.map((supplier) => ({
    ...supplier,
    materials: supplier.materials?.filter((materialId) => materialId !== id)
  }))
  data.customers = data.customers.map((customer) => ({
    ...customer,
    materials: customer.materials?.filter((materialId) => materialId !== id)
  }))
  saveData(data)
}
