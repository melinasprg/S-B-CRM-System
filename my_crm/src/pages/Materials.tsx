import React, { useEffect, useState } from 'react'
import MaterialForm from '../components/MaterialForm'
import { createMaterial, deleteMaterial, getCustomers, getMaterials, getSuppliers, updateMaterial } from '../lib/api'

type Material = { id: number; name: string; quantity: number; price?: number; description?: string }
type Supplier = { id: number; name: string; contact?: string; materials?: number[] }
type Customer = { id: number; name: string; email?: string; materials?: number[] }

export default function Materials() {
  const [data, setData] = useState<Material[] | null>(null)
  const [suppliers, setSuppliers] = useState<Supplier[] | null>(null)
  const [customers, setCustomers] = useState<Customer[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Material | null>(null)
  const [creating, setCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const [materials, suppliers, customers] = await Promise.all([getMaterials(), getSuppliers(), getCustomers()])
      setData(materials)
      setSuppliers(suppliers)
      setCustomers(customers)
    } catch (e) {
      setData([])
      setSuppliers([])
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchData()
  }, [])

  const handleCreate = async (payload: { name: string; quantity: number; price?: number; description?: string }) => {
    const created = await createMaterial(payload)
    setData((d) => (d ? [created, ...d] : [created]))
    setCreating(false)
  }

  const handleUpdate = async (id: number, payload: { name: string; quantity: number; price?: number; description?: string }) => {
    const updated = await updateMaterial(id, payload)
    setData((d) => (d ? d.map((x) => (x.id === id ? updated : x)) : [updated]))
    setEditing(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Dieses Material löschen?')) return
    await deleteMaterial(id)
    setData((d) => (d ? d.filter((x) => x.id !== id) : []))
  }

  const filtered = (data || []).filter((m) => {
    const normalized = searchTerm.toLowerCase()
    return (
      m.name.toLowerCase().includes(normalized) ||
      String(m.price ?? '').toLowerCase().includes(normalized) ||
      (m.description || '').toLowerCase().includes(normalized)
    )
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Materialien</h1>
        <div className="flex items-center space-x-2">
          <input
            placeholder="Suche Materialien nach Name, Preis oder Beschreibung"
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
              + Neues Material
            </button>
          )}
        </div>
      </div>

      {creating && (
        <div className="mb-4">
          <MaterialForm onSave={handleCreate} onCancel={() => setCreating(false)} />
        </div>
      )}

      {editing && (
        <div className="mb-4">
          <MaterialForm
            initial={editing}
            onSave={(payload) => handleUpdate(editing.id, payload)}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {loading ? (
        <p>Lädt...</p>
      ) : !data || data.length === 0 ? (
        <p>Noch keine Materialien gefunden.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((m) => (
            <div key={m.id} className="p-3 bg-white rounded shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-sm text-gray-600">Menge: {m.quantity}</div>
                  <div className="text-sm text-gray-600">Preis: {m.price !== undefined ? `${m.price.toFixed(2)} €` : '—'}</div>
                  <div className="text-sm text-gray-700 mt-1">{m.description || 'Keine Beschreibung vorhanden'}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-2 py-1 btn-edit rounded" onClick={() => setEditing(m)}>
                    Edit
                  </button>
                  <button className="px-2 py-1 btn-delete rounded" onClick={() => void handleDelete(m.id)}>
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm font-semibold">Verkäufer</div>
                <div className="text-sm text-gray-700">
                  {suppliers
                    ? suppliers.filter((s) => s.materials?.includes(m.id)).map((s) => s.name).join(', ') || '—'
                    : '—'}
                </div>
              </div>

              <div className="mt-2">
                <div className="text-sm font-semibold">Einkäufer</div>
                <div className="text-sm text-gray-700">
                  {customers
                    ? customers.filter((c) => c.materials?.includes(m.id)).map((c) => c.name).join(', ') || '—'
                    : '—'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
