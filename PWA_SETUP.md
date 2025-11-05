# PWA Setup Guide

Aplikasi ini sudah dikonfigurasi sebagai Progressive Web App (PWA). Berikut adalah langkah-langkah untuk menyelesaikan setup:

## 1. Install Dependencies

Pastikan `vite-plugin-pwa` sudah terinstall:

```bash
npm install -D vite-plugin-pwa
```

## 2. Generate Icons

Anda perlu membuat icon untuk PWA. Ada beberapa cara:

### Option A: Gunakan Icon Generator (Recommended)

1. Buka file `static/create-icons.html` di browser
2. Klik tombol "Generate All Icons"
3. Icons akan otomatis terdownload
4. Pastikan semua file icons ada di folder `static/`:
   - `pwa-192x192.png`
   - `pwa-512x512.png`
   - `apple-touch-icon.png`
   - `favicon-32x32.png`
   - `favicon-16x16.png`
   - `favicon.ico`

### Option B: Manual dengan Image Editor

Buat icon dengan ukuran yang sesuai menggunakan image editor favorit Anda.

### Option C: Online Tools

- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

## 3. Build & Test

```bash
# Development mode (PWA akan aktif)
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview
```

## 4. Test PWA Features

### Install sebagai App

1. Buka aplikasi di browser mobile (Chrome/Edge)
2. Klik menu browser (3 dots)
3. Pilih "Install app" atau "Add to Home Screen"
4. Aplikasi akan terinstall seperti native app

### Test Offline Mode

1. Install aplikasi
2. Buka DevTools > Application > Service Workers
3. Cek "Offline" checkbox
4. Refresh aplikasi - seharusnya masih bisa diakses

## 5. Fitur PWA yang Tersedia

✅ **Service Worker** - Cache resources untuk offline access
✅ **Web Manifest** - Install sebagai app
✅ **App Icons** - Icon untuk homescreen
✅ **Offline Support** - Aplikasi bisa diakses offline
✅ **Update Notifications** - User akan diberitahu saat ada update
✅ **Runtime Caching** - Cache API calls untuk performa lebih baik

## 6. Konfigurasi

### Manifest Settings

File `vite.config.ts` berisi konfigurasi PWA:

- App name: "ReyNisa App"
- Theme color: #000000 (hitam)
- Display mode: standalone (seperti native app)
- Orientation: portrait

### Service Worker Caching

- Static assets (JS, CSS, HTML, images)
- Google Fonts (CacheFirst)
- CDNJS resources (CacheFirst)
- Supabase API (NetworkFirst dengan timeout)

## 7. Deployment

Pastikan server Anda mengirim:

- `Content-Type: application/manifest+json` untuk `manifest.webmanifest`
- `Content-Type: application/javascript` untuk service worker
- HTTPS (required untuk PWA)

### Netlify

Netlify sudah dikonfigurasi untuk PWA. Pastikan file `_headers` atau `netlify.toml` sudah benar.

## Troubleshooting

### Service Worker tidak register

- Pastikan menggunakan HTTPS atau localhost
- Cek browser console untuk error
- Pastikan `vite-plugin-pwa` sudah terinstall

### Icons tidak muncul

- Pastikan semua file icon ada di folder `static/`
- Cek path di `manifest.webmanifest`
- Clear cache browser

### App tidak bisa install

- Pastikan menggunakan HTTPS
- Pastikan manifest valid (cek di DevTools > Application > Manifest)
- Pastikan service worker sudah ter-register

## Resources

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
- [vite-plugin-pwa Docs](https://vite-pwa-org.netlify.app/)
