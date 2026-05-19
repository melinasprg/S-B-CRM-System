const STORAGE_KEY = 'my-crm-static-data'
const seedData = {
  customers: [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', phone: '+1 555-0123', company: 'Tech Buyers Inc', address: '123 Commerce St', materials: [1] },
    { id: 2, name: 'Bob Jones', email: 'bob@example.com', phone: '+1 555-0456', company: 'Industrial Parts Co', address: '456 Factory Ave', materials: [2] }
  ],
  suppliers: [
    { id: 1, name: 'Acme Supplies', contact: 'acme@example.com', phone: '+1 555-0789', company: 'Acme Holdings', address: '789 Supply Rd', materials: [1, 2] },
    { id: 2, name: 'SupplyCo', contact: 'sales@supplyco.com', phone: '+1 555-0999', company: 'SupplyCo LLC', address: '321 Distribution Blvd', materials: [2] }
  ],
  materials: [
    { id: 1, name: 'Steel Sheets', quantity: 120, price: 15.5, description: 'High-quality steel sheets for construction and fabrication.' },
    { id: 2, name: 'Copper Wire', quantity: 300, price: 8.25, description: 'Flexible copper wire for electrical and grounding applications.' }
  ]
}

function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (err) {
      console.warn('Failed to parse saved data, resetting.', err)
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData))
  return JSON.parse(JSON.stringify(seedData))
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function nextId(items) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

function getRoute() {
  return window.location.hash.replace('#', '') || '/'
}

function setActiveNav() {
  document.querySelectorAll('.app-nav a').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + getRoute())
  })
}

function render() {
  setActiveNav()
  const route = getRoute()
  const root = document.getElementById('root')
  const data = loadData()

  if (route === '/customers') {
    renderCustomers(root, data)
  } else if (route === '/suppliers') {
    renderSuppliers(root, data)
  } else if (route === '/materials') {
    renderMaterials(root, data)
  } else {
    renderHome(root)
  }
}

function createSection(title, description) {
  return `
    <section class="section-card">
      <div class="grid gap-3">
        <div>
          <h1>${title}</h1>
          <p class="small-note">${description}</p>
        </div>
      </div>
    </section>
  `
}

function renderHome(root) {
  root.innerHTML = `
    ${createSection('Willkommen bei CRM von Oxion Energy', 'Ein leichtgewichtiges statisches CRM, das direkt im Browser mit localStorage läuft.')}
    <section class="section-card">
      <div class="grid gap-4 md:grid-2">
        <div class="card">
          <h2>Einkäufer</h2>
          <p>Speichere Einkäufer, E-Mail-Adressen und die Materialien, die sie kaufen.</p>
        </div>
        <div class="card">
          <h2>Verkäufer</h2>
          <p>Verfolge Verkäuferkontakte und die Materialien, die sie liefern.</p>
        </div>
        <div class="card">
          <h2>Materialien</h2>
          <p>Verwalte Materialbestände und verknüpfte Einkäufer und Verkäufer.</p>
        </div>
      </div>
    </section>
  `
}

function renderCustomers(root, data) {
  root.innerHTML = `
    ${createSection('Einkäufer', 'Suche Einkäufer nach Material, füge neue Datensätze hinzu und bearbeite bestehende Einträge.')}
    <section class="section-card">
      <div class="grid gap-3">
        <div class="field">
          <label>Suche Einkäufer</label>
          <input id="customer-search" type="text" placeholder="Suche Name, Firma, Adresse oder Material..." value="" />
        </div>
        <button class="primary" id="new-customer-button">+ Neuer Einkäufer</button>
      </div>
    </section>
    <section class="section-card" id="customer-list"></section>
  `
  const list = document.getElementById('customer-list')
  let searchTerm = ''

  function updateList() {
    const filtered = data.customers.filter((customer) => {
      if (!searchTerm.trim()) return true
      const term = searchTerm.toLowerCase()
      const textFields = [customer.name, customer.email, customer.phone, customer.company, customer.address]
        .filter(Boolean)
        .map((value) => value.toLowerCase())
      const materialNames = (customer.materials || []).map((id) => data.materials.find((m) => m.id === id)?.name || '')
      return textFields.some((value) => value.includes(term)) || materialNames.some((name) => name.toLowerCase().includes(term))
    })
    if (!filtered.length) {
      list.innerHTML = '<div class="card"><p>Keine Einkäufer gefunden.</p></div>'
      return
    }

    list.innerHTML = filtered.map((customer) => {
      const materialNames = (customer.materials || [])
        .map((id) => data.materials.find((m) => m.id === id)?.name)
        .filter(Boolean)
        .join(', ') || '—'

      return `
        <div class="row">
          <div>
            <strong>${customer.name}</strong>
            <div class="small-note">${customer.email || 'Keine E-Mail hinzugefügt'}</div>
            <div class="small-note">${customer.phone || 'Keine Telefonnummer'}</div>
            <div class="small-note">${customer.company || 'Keine Firma'}</div>
            <div class="small-note">${customer.address || 'Keine Adresse'}</div>
            <div class="small-note">Materialien: ${materialNames}</div>
          </div>
          <div class="actions">
            <button class="secondary edit-customer" data-id="${customer.id}">Bearbeiten</button>
            <button class="danger delete-customer" data-id="${customer.id}">Löschen</button>
          </div>
        </div>
      `
    }).join('')
  }

  function showForm(customer) {
    const materialsOptions = data.materials.map((material) => {
      const active = customer?.materials?.includes(material.id) ? 'checked' : ''
      return `
        <label class="chip">
          <input type="checkbox" value="${material.id}" ${active} />
          ${material.name}
        </label>
      `
    }).join('')

    list.innerHTML = `
      <div class="card">
        <form id="customer-form">
          <div class="field">
            <label>Name</label>
            <input type="text" name="name" value="${customer?.name || ''}" required />
          </div>
          <div class="field">
            <label>E-Mail</label>
            <input type="email" name="email" value="${customer?.email || ''}" />
          </div>
          <div class="field">
            <label>Telefon</label>
            <input type="text" name="phone" value="${customer?.phone || ''}" />
          </div>
          <div class="field">
            <label>Firma</label>
            <input type="text" name="company" value="${customer?.company || ''}" />
          </div>
          <div class="field">
            <label>Adresse</label>
            <input type="text" name="address" value="${customer?.address || ''}" />
          </div>
          <div class="field">
            <label>Materialien</label>
            <div class="grid">
              ${materialsOptions}
            </div>
          </div>
          <div class="actions">
            <button class="primary" type="submit">Speichern</button>
            <button class="secondary" type="button" id="cancel-customer">Abbrechen</button>
          </div>
        </form>
      </div>
    `

    document.getElementById('customer-form').addEventListener('submit', (event) => {
      event.preventDefault()
      const form = event.target
      const formData = new FormData(form)
      const selectedMaterials = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map((node) => Number(node.value))
      const payload = {
        name: formData.get('name').toString().trim(),
        email: formData.get('email').toString().trim() || '',
        phone: formData.get('phone').toString().trim() || '',
      }

      if (customer) {
        data.customers = data.customers.map((item) => item.id === customer.id ? { ...item, ...payload } : item)
      } else {
        data.customers.unshift({ id: nextId(data.customers), ...payload })
      }
      saveData(data)
      render()
    })

    document.getElementById('cancel-customer').addEventListener('click', render)
  }

  updateList()

  document.getElementById('customer-search').addEventListener('input', (event) => {
    searchTerm = event.target.value
    updateList()
  })

  document.getElementById('new-customer-button').addEventListener('click', () => showForm(null))

  list.addEventListener('click', (event) => {
    const target = event.target
    if (target.matches('.delete-customer')) {
      const id = Number(target.dataset.id)
      if (confirm('Diesen Einkäufer löschen?')) {
        data.customers = data.customers.filter((item) => item.id !== id)
        saveData(data)
        updateList()
      }
    }
    if (target.matches('.edit-customer')) {
      const id = Number(target.dataset.id)
      const item = data.customers.find((entry) => entry.id === id)
      if (item) showForm(item)
    }
  })
}

function renderSuppliers(root, data) {
  root.innerHTML = `
    ${createSection('Verkäufer', 'Verfolge Verkäufer und die Materialien, die sie liefern.')}
    <section class="section-card">
      <div class="grid gap-3">
        <div class="field">
          <label>Suche Verkäufer</label>
          <input id="supplier-search" type="text" placeholder="Suche Name, Firma, Adresse oder Material..." value="" />
        </div>
        <button class="primary" id="new-supplier-button">+ Neuer Verkäufer</button>
      </div>
    </section>
    <section class="section-card" id="supplier-list"></section>
  `
  const list = document.getElementById('supplier-list')
  let searchTerm = ''

  function updateList() {
    const filtered = data.suppliers.filter((supplier) => {
      if (!searchTerm.trim()) return true
      const term = searchTerm.toLowerCase()
      const textFields = [supplier.name, supplier.contact, supplier.phone, supplier.company, supplier.address]
        .filter(Boolean)
        .map((value) => value.toLowerCase())
      const materialNames = (supplier.materials || []).map((id) => data.materials.find((m) => m.id === id)?.name || '')
      return textFields.some((value) => value.includes(term)) || materialNames.some((name) => name.toLowerCase().includes(term))
    })
    if (!filtered.length) {
      list.innerHTML = '<div class="card"><p>Keine Verkäufer gefunden.</p></div>'
      return
    }

    list.innerHTML = filtered.map((supplier) => {
      const materialNames = (supplier.materials || [])
        .map((id) => data.materials.find((m) => m.id === id)?.name)
        .filter(Boolean)
        .join(', ') || '—'

      return `
        <div class="row">
          <div>
            <strong>${supplier.name}</strong>
            <div class="small-note">${supplier.contact || 'Kein Kontakt hinzugefügt'}</div>
            <div class="small-note">${supplier.phone || 'Keine Telefonnummer'}</div>
            <div class="small-note">${supplier.company || 'Keine Firma'}</div>
            <div class="small-note">${supplier.address || 'Keine Adresse'}</div>
            <div class="small-note">Materialien: ${materialNames}</div>
          </div>
          <div class="actions">
            <button class="secondary edit-supplier" data-id="${supplier.id}">Bearbeiten</button>
            <button class="danger delete-supplier" data-id="${supplier.id}">Löschen</button>
          </div>
        </div>
      `
    }).join('')
  }

  function showForm(supplier) {
    const materialsOptions = data.materials.map((material) => {
      const active = supplier?.materials?.includes(material.id) ? 'checked' : ''
      return `
        <label class="chip">
          <input type="checkbox" value="${material.id}" ${active} />
          ${material.name}
        </label>
      `
    }).join('')

    list.innerHTML = `
      <div class="card">
        <form id="supplier-form">
          <div class="field">
            <label>Name</label>
            <input type="text" name="name" value="${supplier?.name || ''}" required />
          </div>
          <div class="field">
            <label>Kontakt</label>
            <input type="text" name="contact" value="${supplier?.contact || ''}" />
          </div>
          <div class="field">
            <label>Telefon</label>
            <input type="text" name="phone" value="${supplier?.phone || ''}" />
          </div>
          <div class="field">
            <label>Firma</label>
            <input type="text" name="company" value="${supplier?.company || ''}" />
          </div>
          <div class="field">
            <label>Adresse</label>
            <input type="text" name="address" value="${supplier?.address || ''}" />
          </div>
          <div class="field">
            <label>Materialien</label>
            <div class="grid">
              ${materialsOptions}
            </div>
          </div>
          <div class="actions">
            <button class="primary" type="submit">Speichern</button>
            <button class="secondary" type="button" id="cancel-supplier">Abbrechen</button>
          </div>
        </form>
      </div>
    `

    document.getElementById('supplier-form').addEventListener('submit', (event) => {
      event.preventDefault()
      const form = event.target
      const selectedMaterials = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map((node) => Number(node.value))
      const formData = new FormData(form)
      const payload = {
        name: formData.get('name').toString().trim(),
        contact: formData.get('contact').toString().trim() || '',
        phone: formData.get('phone').toString().trim() || '',
      }

      if (supplier) {
        data.suppliers = data.suppliers.map((item) => item.id === supplier.id ? { ...item, ...payload } : item)
      } else {
        data.suppliers.unshift({ id: nextId(data.suppliers), ...payload })
      }
      saveData(data)
      render()
    })

    document.getElementById('cancel-supplier').addEventListener('click', render)
  }

  updateList()

  document.getElementById('supplier-search').addEventListener('input', (event) => {
    searchTerm = event.target.value
    updateList()
  })

  document.getElementById('new-supplier-button').addEventListener('click', () => showForm(null))

  list.addEventListener('click', (event) => {
    const target = event.target
    if (target.matches('.delete-supplier')) {
      const id = Number(target.dataset.id)
      if (confirm('Diesen Verkäufer löschen?')) {
        data.suppliers = data.suppliers.filter((item) => item.id !== id)
        saveData(data)
        updateList()
      }
    }
    if (target.matches('.edit-supplier')) {
      const id = Number(target.dataset.id)
      const item = data.suppliers.find((entry) => entry.id === id)
      if (item) showForm(item)
    }
  })
}

function renderMaterials(root, data) {
  root.innerHTML = `
    ${createSection('Materialien', 'Verwalte Bestände und sehe, welche Einkäufer und Verkäufer jedes Material nutzen.')}
    <section class="section-card">
      <div class="grid gap-3">
        <div class="field">
          <label>Suche Materialien</label>
          <input id="material-search" type="text" placeholder="Suche Name, Preis oder Beschreibung..." value="" />
        </div>
        <button class="primary" id="new-material-button">+ Neues Material</button>
      </div>
    </section>
    <section class="section-card" id="material-list"></section>
  `
  const list = document.getElementById('material-list')
  let searchTerm = ''

  function updateList() {
    const filtered = data.materials.filter((material) => {
      const term = searchTerm.toLowerCase()
      return (
        material.name.toLowerCase().includes(term) ||
        (material.description || '').toLowerCase().includes(term) ||
        String(material.price || '').toLowerCase().includes(term)
      )
    })

    if (!filtered.length) {
      list.innerHTML = '<div class="card"><p>Keine Materialien gefunden.</p></div>'
      return
    }

    list.innerHTML = filtered.map((material) => {
      const supplierNames = data.suppliers.filter((supplier) => supplier.materials?.includes(material.id)).map((s) => s.name).join(', ') || '—'
      const customerNames = data.customers.filter((customer) => customer.materials?.includes(material.id)).map((c) => c.name).join(', ') || '—'

      return `
        <div class="row">
          <div>
            <strong>${material.name}</strong>
            <div class="small-note">Menge: ${material.quantity}</div>
            <div class="small-note">Preis: ${material.price !== undefined ? material.price.toFixed(2) + ' €' : '—'}</div>
            <div class="small-note">${material.description || 'Keine Beschreibung vorhanden'}</div>
            <div class="small-note">Verkäufer: ${supplierNames}</div>
            <div class="small-note">Einkäufer: ${customerNames}</div>
          </div>
          <div class="actions">
            <button class="secondary edit-material" data-id="${material.id}">Bearbeiten</button>
            <button class="danger delete-material" data-id="${material.id}">Löschen</button>
          </div>
        </div>
      `
    }).join('')
  }

  function showForm(material) {
    list.innerHTML = `
      <div class="card">
        <form id="material-form">
          <div class="field">
            <label>Name</label>
            <input type="text" name="name" value="${material?.name || ''}" required />
          </div>
          <div class="field">
            <label>Menge</label>
            <input type="number" name="quantity" value="${material?.quantity || 0}" min="0" required />
          </div>
          <div class="field">
            <label>Preis</label>
            <input type="number" step="0.01" name="price" value="${material?.price ?? ''}" />
          </div>
          <div class="field">
            <label>Beschreibung</label>
            <textarea name="description" rows="3">${material?.description || ''}</textarea>
          </div>
          <div class="actions">
            <button class="primary" type="submit">Speichern</button>
            <button class="secondary" type="button" id="cancel-material">Abbrechen</button>
          </div>
        </form>
      </div>
    `

    document.getElementById('material-form').addEventListener('submit', (event) => {
      event.preventDefault()
      const formData = new FormData(event.target)
      const payload = {
        name: formData.get('name').toString().trim(),
        quantity: Number(formData.get('quantity')),
        price: Number(formData.get('price')) || undefined,
        description: formData.get('description').toString().trim() || ''
      }

      if (material) {
        data.materials = data.materials.map((item) => item.id === material.id ? { ...item, ...payload } : item)
      } else {
        data.materials.unshift({ id: nextId(data.materials), ...payload })
      }
      saveData(data)
      render()
    })

    document.getElementById('cancel-material').addEventListener('click', render)
  }

  updateList()

  document.getElementById('material-search').addEventListener('input', (event) => {
    searchTerm = event.target.value
    updateList()
  })

  document.getElementById('new-material-button').addEventListener('click', () => showForm(null))

  list.addEventListener('click', (event) => {
    const target = event.target
    if (target.matches('.delete-material')) {
      const id = Number(target.dataset.id)
      if (confirm('Dieses Material löschen?')) {
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
        updateList()
      }
    }
    if (target.matches('.edit-material')) {
      const id = Number(target.dataset.id)
      const item = data.materials.find((entry) => entry.id === id)
      if (item) showForm(item)
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  render()
  window.addEventListener('hashchange', render)
})
