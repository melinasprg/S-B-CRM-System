# CRM von Oxion Energy (Frontend)

Dies ist ein einfaches React + Vite + TypeScript Frontend für ein CRM. Es verwendet `localStorage` im Browser, so dass es als statische App ohne Backend läuft. Das Projekt kann auch in einen `docs/`-Ordner gebaut werden, der für GitHub Pages geeignet ist.

Kurzanleitung

1. Install dependencies

```bash
npm install
```

2. Run the dev server (requires Node.js)

```bash
npm run dev
```

3. Build for production (requires Node.js)

```bash
npm run build
```

## Kein Backend zur Laufzeit erforderlich

Die App speichert CRM-Daten jetzt direkt im Browser mit `localStorage`.
Das bedeutet, dass die UI als vollständig statisches Frontend ohne `json-server` oder separates Backend funktioniert.

- Kunden, Verkäufer und Materialien werden beim ersten Start aus `db.json` geladen.
- Änderungen werden im Browser gespeichert, sodass die App auch ohne Node.js lauffähig bleibt.

## Öffne die statische App in Chrome

A direct static version is available at:

```text
c:\Users\melin\OneDrive\Desktop\my_crm\docs\index.html
```

Open that file in Chrome using the file path or `file:///` URL.

## Deployment als statische Seite

1. Baue die App mit:

```bash
npm run build
```

2. Veröffentliche den generierten `docs/`-Ordner auf einem beliebigen statischen Host.

> Wenn Node.js nicht installiert ist, kann die App weiterhin als statische Seite aus `docs/index.html` ausgeführt werden.

## Hinweise

- The previous `json-server` backend is no longer required for app functionality.
- A static browser-only version is now available in `docs/`.
- TypeScript and Tailwind are still included; adjust styles in `src/index.css` and `tailwind.config.cjs`.

Suche und Beziehungen

- Verkäufer und Einkäufer enthalten in `db.json` ein `materials`-Array mit Material-IDs, die sie liefern oder kaufen. Die App bietet Suchfelder, um Verkäufer/Einkäufer nach Materialien zu finden und verknüpfte Einträge auf der Materialseite anzuzeigen.

