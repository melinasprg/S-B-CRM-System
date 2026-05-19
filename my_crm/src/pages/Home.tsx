import React from 'react'

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Willkommen beim CRM von Oxion Energy</h1>
      <p className="mb-4">Dies ist ein einfaches Frontend für Kunden- und Lieferantenverwaltung.</p>
      <ul className="list-disc pl-5">
        <li>Einkäuferliste und Details</li>
        <li>Verkäuferliste und Details</li>
        <li>Materialbestände</li>
      </ul>
    </div>
  )
}
