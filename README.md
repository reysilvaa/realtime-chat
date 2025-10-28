# 💕 Generator Surat Izin Keluar

Aplikasi generator surat izin keluar untuk pacar yang dibangun dengan HTML, CSS, JavaScript vanilla, dan Supabase sebagai backend. Aplikasi ini dapat di-deploy secara gratis di Netlify dengan format surat yang resmi dan tampilan yang cantik.

## ✨ Fitur

- 💕 **Surat Izin Resmi** - Format surat yang formal dan profesional
- 🤖 **Auto-detect Nama** - Otomatis mendeteksi nama berdasarkan device (iOS = Annisa, Android/Windows = Rey)
- 📱 **Responsive Design** - Tampilan yang optimal di desktop dan mobile
- 🎨 **UI Modern** - Desain yang cantik dengan gradient dan animasi
- 🖨️ **Print Ready** - Siap untuk dicetak dengan format yang rapi
- 💾 **Auto Save** - Menyimpan riwayat surat yang pernah dibuat
- 🔒 **Secure** - Menggunakan Row Level Security (RLS) Supabase
- ⚡ **Fast** - Static site yang loading cepat
- 🆓 **Gratis** - Menggunakan layanan gratis (Supabase + Netlify)

## 🚀 Demo

[Live Demo](https://your-app-name.netlify.app) _(ganti dengan URL deployment Anda)_

## 🛠️ Setup & Installation

### 1. Setup Supabase

1. Buat akun di [Supabase](https://supabase.com) (gratis)
2. Buat project baru
3. Buka **SQL Editor** di dashboard Supabase
4. Copy dan jalankan script dari file `supabase-setup.sql`
5. Catat **Project URL** dan **anon key** dari **Settings > API**

### 2. Konfigurasi Aplikasi

1. Clone atau download repository ini
2. Buka file `script.js`
3. Ganti kredensial Supabase:
   ```javascript
   const SUPABASE_URL = "https://your-project-id.supabase.co";
   const SUPABASE_ANON_KEY = "your-anon-key-here";
   ```

### 3. Testing Lokal

1. Buka file `index.html` di browser
2. Atau gunakan live server:

   ```bash
   # Jika menggunakan Python
   python -m http.server 8000

   # Jika menggunakan Node.js
   npx serve .
   ```

## 🌐 Deployment ke Netlify

### Opsi 1: Drag & Drop (Termudah)

1. Buka [Netlify](https://netlify.com)
2. Drag & drop folder project ke area deployment
3. Aplikasi akan otomatis ter-deploy

### Opsi 2: Git Integration

1. Push code ke GitHub/GitLab
2. Connect repository di Netlify
3. Deploy otomatis setiap ada push

### Opsi 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login ke Netlify
netlify login

# Deploy
netlify deploy --prod --dir .
```

## 📁 Struktur Project

```
realtime-chat/
├── index.html          # Halaman utama
├── style.css           # Styling CSS
├── script.js           # Logic JavaScript
├── supabase-setup.sql  # Script setup database
├── netlify.toml        # Konfigurasi Netlify
├── _headers            # HTTP headers untuk Netlify
└── README.md           # Dokumentasi ini
```

## 🔧 Konfigurasi Database

Tabel `messages` memiliki struktur:

- `id` (BIGSERIAL) - Primary key
- `username` (VARCHAR) - Nama pengirim
- `message` (TEXT) - Isi pesan
- `created_at` (TIMESTAMP) - Waktu kirim

## 🔒 Keamanan

- **Row Level Security (RLS)** diaktifkan
- **XSS Protection** dengan escape HTML
- **Security headers** via Netlify
- **Input validation** di frontend

## 📱 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🎨 Customization

### Mengubah Tema Warna

Edit variabel CSS di `style.css`:

```css
/* Ganti gradient utama */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Ganti warna accent */
background: #2ed573; /* Success color */
background: #ff4757; /* Error color */
```

### Menambah Fitur

Beberapa ide pengembangan:

- Emoji picker
- File sharing
- Private rooms
- User avatars
- Message reactions
- Typing indicators yang lebih advanced

## 🐛 Troubleshooting

### Pesan tidak muncul realtime

- Pastikan kredensial Supabase benar
- Cek console browser untuk error
- Pastikan realtime enabled di Supabase

### Error saat deploy

- Pastikan semua file ter-upload
- Cek build logs di Netlify
- Pastikan tidak ada typo di konfigurasi

### Aplikasi tidak bisa connect

- Cek network connection
- Pastikan Supabase project aktif
- Cek CORS settings di Supabase

## 📄 License

MIT License - bebas digunakan untuk project pribadi maupun komersial.

## 🤝 Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## 📞 Support

Jika ada pertanyaan atau issue:

1. Buka GitHub Issues
2. Sertakan screenshot error
3. Jelaskan langkah reproduksi

---

**Happy Chatting! 💬✨**
