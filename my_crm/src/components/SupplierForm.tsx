import React, { useEffect, useState } from 'react'
import { getMaterials, Material } from '../lib/api'

type SupplierPayload = { name: string; contact?: string; phone?: string; company?: string; address?: string }
type Supplier = { id: number; name: string; contact?: string; phone?: string; company?: string; address?: string; materials?: number[] }

export default function SupplierForm({
  initial,
  onSave,
  onCancel
}: {
  initial?: Supplier | null
  onSave: (payload: SupplierPayload & { materials?: number[] }) => void | Promise<void>
  onCancel?: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [contact, setContact] = useState(initial?.contact ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [company, setCompany] = useState(initial?.company ?? '')
  const [address, setAddress] = useState(initial?.address ?? '')
  const [materials, setMaterials] = useState<number[]>(initial?.materials ?? [])
  const [allMaterials, setAllMaterials] = useState<Material[] | null>(null)
  const [materialQuery, setMaterialQuery] = useState('')

  useEffect(() => {
    setName(initial?.name ?? '')
    setContact(initial?.contact ?? '')
    setPhone(initial?.phone ?? '')
    setCompany(initial?.company ?? '')
    setAddress(initial?.address ?? '')
    setMaterials(initial?.materials ?? [])
  }, [initial])

  useEffect(() => {
    void getMaterials()
      .then(setAllMaterials)
      .catch(() => setAllMaterials([]))
  }, [])

  const toggleMaterial = (id: number) => {
    setMaterials((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return alert('Name ist erforderlich')
    await onSave({
      name: name.trim(),
      contact: contact.trim() || undefined,
      phone: phone.trim() || undefined,
      company: company.trim() || undefined,
      address: address.trim() || undefined,
      materials
    })
  }

  return (
    <form onSubmit={submit} className="p-4 bg-white rounded shadow-sm">
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-2 py-1" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Kontakt</label>
        <input value={contact} onChange={(e) => setContact(e.target.value)} className="w-full border rounded px-2 py-1" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Telefon</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded px-2 py-1" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Firma</label>
        <input value={company} onChange={(e) => setCompany(e.target.value)} className="w-full border rounded px-2 py-1" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Adresse</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded px-2 py-1" />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Materialien</label>
        <div>
          <input
            placeholder="Materialien filtern..."
            value={materialQuery}
            onChange={(e) => setMaterialQuery(e.target.value)}
            className="w-full mb-2 border rounded px-2 py-1"
          />

          <div className="mb-2 text-sm">Ausgewählt: {materials.length} {materials.length === 1 ? 'Material' : 'Materialien'}</div>

          <div className="grid gap-2 sm:grid-cols-2 max-h-48 overflow-auto">
            {allMaterials === null ? (
              <div>Materialien werden geladen...</div>
            ) : allMaterials.length === 0 ? (
              <div>Keine Materialien verfügbar</div>
            ) : (
              allMaterials
                .filter((m) => m.name.toLowerCase().includes(materialQuery.toLowerCase()))
                .map((m) => (
                  <label key={m.id} className="flex items-center space-x-2">
                    <input type="checkbox" checked={materials.includes(m.id)} onChange={() => toggleMaterial(m.id)} />
                    <span className="text-sm">{m.name}</span>
                  </label>
                ))
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 mt-3">
        <button type="submit" className="px-3 py-2 btn-primary rounded">Speichern</button>
        {onCancel && (
          <button type="button" className="px-3 py-2 btn-muted rounded" onClick={onCancel}>
            Abbrechen
          </button>
        )}
      </div>
    </form>
  )
}
