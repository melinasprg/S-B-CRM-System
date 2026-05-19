import React, { useEffect, useState } from 'react'

type MaterialPayload = { name: string; quantity: number; price?: number; description?: string }
type Material = { id: number; name: string; quantity: number; price?: number; description?: string }

export default function MaterialForm({
  initial,
  onSave,
  onCancel
}: {
  initial?: Material | null
  onSave: (payload: MaterialPayload) => void | Promise<void>
  onCancel?: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [quantity, setQuantity] = useState(initial?.quantity ?? 0)
  const [price, setPrice] = useState(initial?.price ?? 0)
  const [description, setDescription] = useState(initial?.description ?? '')

  useEffect(() => {
    setName(initial?.name ?? '')
    setQuantity(initial?.quantity ?? 0)
    setPrice(initial?.price ?? 0)
    setDescription(initial?.description ?? '')
  }, [initial])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return alert('Name ist erforderlich')
    if (Number.isNaN(Number(quantity))) return alert('Menge muss eine Zahl sein')
    if (Number.isNaN(Number(price))) return alert('Preis muss eine Zahl sein')
    await onSave({
      name: name.trim(),
      quantity: Number(quantity),
      price: price ? Number(price) : undefined,
      description: description.trim() || undefined
    })
  }

  return (
    <form onSubmit={submit} className="p-4 bg-white rounded shadow-sm">
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-2 py-1" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Menge</label>
        <input
          type="number"
          value={String(quantity)}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Preis</label>
        <input
          type="number"
          step="0.01"
          value={String(price)}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Beschreibung</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-2 py-1"
          rows={3}
        />
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
