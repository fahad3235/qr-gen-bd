# qr-gen-bd

Bilingual (English / বাংলা) QR code generator that works **100% offline** — no internet connection needed, nothing is ever uploaded anywhere.

## Problem

Free online QR generators require an internet connection and send your data (WiFi passwords, phone numbers, links) to third-party servers. People in Bangladesh — students, shop owners, event organizers — need a private, offline, Bangla-friendly way to make QR codes for WiFi sharing, contact cards, links, and plain text.

## Features

- **4 content modes**
  - **Text** — any text, including Bangla (UTF-8)
  - **URL** — validates format, auto-adds `https://` when the scheme is omitted
  - **WiFi** — SSID / password / WPA-WEP-nopass, emits the standard `WIFI:T:WPA;S:…;P:…;;` payload with `; , : \ "` escaping
  - **vCard** — name + phone → `BEGIN:VCARD … END:VCARD`
- **Size selector** — 256 / 512 / 1024 px canvas output
- **Error-correction level** — L / M / Q / H
- **PNG download** via `canvas.toDataURL` (real file download, verified non-empty)
- **History** — every generated code saved with mode, text and timestamp (localStorage); click any entry to regenerate it instantly
- **Export / Import** — history as JSON file, re-importable later
- **Full EN/বাংলা UI toggle** (persisted), mobile-responsive down to 390 px
- **Validation + empty states** — invalid URLs, empty fields, missing WiFi passwords are rejected with a visible message

## Stack

- Plain HTML + CSS + vanilla JavaScript (no build step, no framework)
- QR engine: [`qrcode-generator`](https://github.com/kazuhikoarase/qrcode-generator) v1.4.4 by Kazuhiko Arase, **MIT licensed**, vendored locally as `js/qrcode.js` (single file, no CDN at runtime)
- Rendering: HTML `<canvas>` with a standard 4-module quiet zone; UTF-8 byte mode forced so Bangla text encodes correctly

## Prerequisites

- Any modern browser (Chrome, Edge, Firefox, Safari). No server, no Node, no internet required.

## Install

No installation. Copy the folder (or unzip) and open `index.html`:

```
qr-gen-bd/
├── index.html
├── css/
│   └── app.css
└── js/
    ├── app.js        # app logic + i18n
    └── qrcode.js     # vendored qrcode-generator 1.4.4 (MIT)
```

## Dev commands

There is no build. Useful checks:

```sh
# syntax check the app JS
node --check js/app.js

# static audit: no external (http/https) *resource references* in app source
# (the only https:// literals are UI hint copy and URL-payload construction;
#  zero requests are made at runtime — verified by the test suite)
grep -rnE '(src|href)\s*=\s*"https?://' index.html || echo "no external resources"
grep -rnE 'fetch\(|XMLHttpRequest|sendBeacon' js/app.js || echo "no network APIs used"
```

## Env

**None.** There are no environment variables, no API keys, no config files. The app is fully static.

## Testing

Real headless-Chromium tests (puppeteer-core + Chrome 152), run against `file://`:

```sh
cd /tmp/qatest
npm install puppeteer-core        # one-time
node test.cjs
```

The suite (**29 checks, 0 failures**) covers:

| # | Check |
|---|-------|
| 1–2 | Page loads; app + vendored lib present; test-only decoder injected |
| 3–5 | Text mode generates; canvas has dark modules; **decodes to exact input** |
| 6 | Bangla text `ঢাকা বাংলাদেশ` **decodes to exact input** |
| 7–8 | URL mode auto-prefixes `https://`; full URL with path decodes exact |
| 9 | Invalid URL rejected (no QR, visible error) |
| 10–13 | WiFi payload `WIFI:T:WPA;S:TestNet;P:secret123;;` decodes exact; special chars escaped; open-network (`nopass`) decodes exact; WPA without password rejected |
| 14 | vCard decodes to exact `BEGIN:VCARD…END:VCARD` payload |
| 15 | Empty text rejected |
| 16 | Sizes 256/512/1024 produce distinct canvas widths |
| 17 | EC levels L/M/Q/H all decode to exact input |
| 18 | PNG download produces a **non-empty, magic-byte-valid** PNG file |
| 19–20 | History populated; persists across reload via localStorage |
| 21 | Clicking a history entry regenerates it |
| 22–23 | BN toggle switches UI to Bangla (persisted); toggle back restores English |
| 24–26 | Export writes valid JSON; Clear empties history; Import restores it |
| 27 | 390 px viewport: no horizontal overflow |
| 28 | **Zero runtime `http(s)` requests** (request interception) |
| 29 | **Zero console / page errors** |

Round-trip decoding uses `jsQR` injected **only into the test page** (`/tmp/jsqr-testonly.js`) — it is never shipped with the app.

## Deployment

GitHub Pages compatible: it is a static site with relative paths. Upload the folder contents to any static host (GitHub Pages, Netlify Drop, or just open `index.html` locally).

## Limitations

- **WiFi passwords are user-entered and stored only in that user's own browser `localStorage`** (as part of history). Nothing is transmitted anywhere — but anyone with access to that browser profile can read the history. Clear history on shared devices.
- QR data capacity follows the QR standard (max version 40): very long text is rejected with a message.
- No logo/image embedding in the QR, no SVG export (PNG only).
- History/export live in one browser profile; they don't sync across devices.
- `js/qrcode.js` contains one remaining `http://` literal: the W3C SVG **namespace identifier** string inside the unused `createSvgTag()` code path. It is a namespace URI, never fetched; the app renders via canvas only. Comment-only upstream URLs in the file header were rewritten to scheme-less attribution text (original archived at build time).

## Status

✅ **Built & verified** — 2026-10-12 (factory run #34). 29/29 headless-Chromium checks pass, 0 console errors, QR round-trip decode exact for text / Bangla / URL / WiFi / vCard, zero runtime network requests. Not yet published (publication handled separately).

---

### Third-party credit

**qrcode-generator** — Copyright (c) 2009 Kazuhiko Arase, MIT License, vendored as `js/qrcode.js`.

> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.
