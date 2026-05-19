import React, { useEffect, useState } from 'react'
import SupplierForm from '../components/SupplierForm'
import { createSupplier, deleteSupplier, getMaterials, getSuppliers, updateSupplier } from '../lib/api'

type Supplier = { id: number; name: string; contact?: string; phone?: string; company?: string; address?: string; materials?: number[] }
type Material = { id: number; name: string }

export default function Suppliers() {
  const [data, setData] = useState<Supplier[] | null>(null)
  const [materials, setMaterials] = useState<Material[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [creating, setCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const [suppliers, materials] = await Promise.all([getSuppliers(), getMaterials()])
      setData(suppliers)
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

  const handleCreate = async (payload: { name: string; contact?: string; phone?: string; company?: string; address?: string; materials?: number[] }) => {
    const created = await createSupplier(payload)
    setData((d) => (d ? [created, ...d] : [created]))
    setCreating(false)
  }

  const handleUpdate = async (id: number, payload: { name: string; contact?: string; phone?: string; company?: string; address?: string; materials?: number[] }) => {
    const updated = await updateSupplier(id, payload)
    setData((d) => (d ? d.map((x) => (x.id === id ? updated : x)) : [updated]))
    setEditing(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Diesen Verkäufer löschen?')) return
    await deleteSupplier(id)
    setData((d) => (d ? d.filter((x) => x.id !== id) : []))
  }

  const matchesSearch = (supplier: Supplier) => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    const textFields = [supplier.name, supplier.contact, supplier.phone, supplier.company, supplier.address]
      .filter(Boolean)
      .map((value) => value!.toLowerCase())
    const materialNames = materials?.filter((m) => supplier.materials?.includes(m.id)).map((m) => m.name.toLowerCase()) || []
    return textFields.some((value) => value.includes(term)) || materialNames.some((name) => name.includes(term))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Verkäufer</h1>
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
              + Neuer Verkäufer
            </button>
          )}
        </div>
      </div>

      {creating && (
        <div className="mb-4">
          <SupplierForm onSave={handleCreate} onCancel={() => setCreating(false)} />
        </div>
      )}

      {editing && (
        <div className="mb-4">
          <SupplierForm
            initial={editing}
            onSave={(payload) => handleUpdate(editing.id, payload)}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {loading ? (
        <p>Lädt...</p>
      ) : !data || data.length === 0 ? (
        <p>Noch keine Verkäufer gefunden.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {data.filter(matchesSearch).map((s) => (
            <div key={s.id} className="card flex items-center justify-between">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-gray-600">{s.contact}</div>
                <div className="text-sm text-gray-600">{s.phone || 'Keine Telefonnummer'}</div>
                <div className="text-sm text-gray-600">{s.company || 'Keine Firma'}</div>
                <div className="text-sm text-gray-600">{s.address || 'Keine Adresse'}</div>
                <div className="text-sm mt-1">Materialien: {s.materials && materials
                  ? s.materials.map((id) => materials.find((m) => m.id === id)?.name).filter(Boolean).join(', ')
                  : '—'}</div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-2 py-1 btn-edit rounded" onClick={() => setEditing(s)}>
                  Bearbeiten
                </button>
                <button className="px-2 py-1 btn-delete rounded" onClick={() => void handleDelete(s.id)}>
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
