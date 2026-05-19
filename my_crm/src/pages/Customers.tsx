import React, { useEffect, useState } from 'react'
import CustomerForm from '../components/CustomerForm'
import { createCustomer, deleteCustomer, getCustomers, getMaterials, updateCustomer } from '../lib/api'

type Customer = { id: number; name: string; email?: string; phone?: string; company?: string; address?: string; materials?: number[] }
type Material = { id: number; name: string }

export default function Customers() {
  const [data, setData] = useState<Customer[] | null>(null)
  const [materials, setMaterials] = useState<Material[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [creating, setCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const [customers, materials] = await Promise.all([getCustomers(), getMaterials()])
      setData(customers)
      setMaterials(materials)
    } catch (e) {
      setData([])
      setMaterials([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  const handleCreate = async (payload: { name: string; email?: string; phone?: string; company?: string; address?: string; materials?: number[] }) => {
    const created = await createCustomer(payload)
    setData((d) => (d ? [created, ...d] : [created]))
    setCreating(false)
  }

  const handleUpdate = async (id: number, payload: { name: string; email?: string; phone?: string; company?: string; address?: string; materials?: number[] }) => {
    const updated = await updateCustomer(id, payload)
    setData((d) => (d ? d.map((x) => (x.id === id ? updated : x)) : [updated]))
    setEditing(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Diesen Einkäufer löschen?')) return
    await deleteCustomer(id)
    setData((d) => (d ? d.filter((x) => x.id !== id) : []))
  }

  const matchesSearch = (customer: Customer) => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    const textFields = [customer.name, customer.email, customer.phone, customer.company, customer.address]
      .filter(Boolean)
      .map((value) => value!.toLowerCase())
    const materialNames = materials?.filter((m) => customer.materials?.includes(m.id)).map((m) => m.name.toLowerCase()) || []
    return textFields.some((value) => value.includes(term)) || materialNames.some((name) => name.includes(term))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Einkäufer</h1>
        <div className="flex items-center space-x-2">
          <input
            placeholder="Suche nach Name, Firma, Adresse oder Material"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1"
          />
          {creating ? (
            <button className="px-3 py-2 btn-muted rounded" onClick={() => setCreating(false)}>
              Abbrechen
            </button>
          ) : (
            <button className="px-3 py-2 btn-primary rounded" onClick={() => setCreating(true)}>
              + Neuer Einkäufer
            </button>
          )}
        </div>
      </div>

      {creating && (
        <div className="mb-4">
          <CustomerForm onSave={handleCreate} onCancel={() => setCreating(false)} />
        </div>
      )}

      {editing && (
        <div className="mb-4">
          <CustomerForm
            initial={editing}
            onSave={(payload) => handleUpdate(editing.id, payload)}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {loading ? (
        <p>Lädt...</p>
      ) : !data || data.length === 0 ? (
        <p>Noch keine Einkäufer gefunden.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {data.filter(matchesSearch).map((c) => (
            <div key={c.id} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-gray-600">{c.email}</div>
                <div className="text-sm text-gray-600">{c.phone || 'Keine Telefonnummer'}</div>
                <div className="text-sm text-gray-600">{c.company || 'Keine Firma'}</div>
                <div className="text-sm text-gray-600">{c.address || 'Keine Adresse'}</div>
                <div className="text-sm mt-1">Materialien: {c.materials && materials
                  ? c.materials.map((id) => materials.find((m) => m.id === id)?.name).filter(Boolean).join(', ')
                  : '—'}</div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-2 py-1 btn-edit rounded" onClick={() => setEditing(c)}>
                  Bearbeiten
                </button>
                <button className="px-2 py-1 btn-delete rounded" onClick={() => void handleDelete(c.id)}>
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
