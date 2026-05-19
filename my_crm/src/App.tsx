import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Customers from './pages/Customers'
import Suppliers from './pages/Suppliers'
import Materials from './pages/Materials'

export default function App() {
  const [route, setRoute] = useState(window.location.hash || '#/')

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  let Page = <Home />
  if (route.startsWith('#/customers')) Page = <Customers />
  if (route.startsWith('#/suppliers')) Page = <Suppliers />
  if (route.startsWith('#/materials')) Page = <Materials />

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="p-4 sm:p-6 max-w-6xl mx-auto">{Page}</main>
    </div>
  )
}
