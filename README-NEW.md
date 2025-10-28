# 💕 Rey & Annisa - Realtime App

Multi-feature application untuk Rey & Annisa dengan fitur Chat dan Surat Izin Keluar.

## 🌟 Fitur

### 1. **Chat Real-time**
- Kirim dan terima pesan secara real-time
- Auto-detect sender/recipient berdasarkan device
- Read receipts (checkmark)
- Responsive mobile-first design
- Typing indicator (future)

### 2. **Surat Izin Keluar**
- Generate surat izin keluar otomatis
- Auto-detect pembuat surat berdasarkan device
- Simpan riwayat surat
- Export ke PDF/Print
- Form validation

## 📱 Device Detection Logic

Aplikasi otomatis mendeteksi user berdasarkan device:

- **iOS (iPhone/iPad)**: User = Annisa
- **Android**: User = Rey
- **Desktop/Others**: User = Rey (default)

## 🗂️ Struktur Proyek

```
realtime-chat/
├── index.html              # Landing page dengan menu
├── chat.html               # Halaman chat
├── izin-keluar.html        # Halaman surat izin
│
├── css/
│   ├── base.css            # Variables & reset
│   ├── landing.css         # Landing page styles
│   ├── chat.css            # Chat styles
│   ├── header.css          # Header styles
│   ├── form.css            # Form styles
│   ├── buttons.css         # Button styles
│   ├── letter.css          # Letter/document styles
│   ├── history.css         # History section
│   ├── notification.css    # Toast notifications
│   ├── animations.css      # Animations
│   ├── print.css           # Print media queries
│   └── responsive.css      # Responsive breakpoints
│
├── js/
│   ├── config.js           # Supabase config
│   ├── landing.js          # Landing page logic
│   │
│   ├── chat/
│   │   ├── main.js         # Chat entry point
│   │   ├── user.js         # User detection
│   │   ├── messages.js     # Message operations
│   │   └── ui.js           # UI utilities
│   │
│   ├── device.js           # Device detection
│   ├── dom.js              # DOM elements
│   ├── form.js             # Form handling
│   ├── letter.js           # Letter generation
│   ├── supabase.js         # Supabase operations
│   ├── storage.js          # LocalStorage
│   ├── ui.js               # UI utilities
│   └── utils.js            # Helper functions
│
└── supabase-setup.sql      # Database schema
```

## 🗄️ Database Schema

### Messages Table
```sql
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    sender_name VARCHAR(100) NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Letters Table
```sql
CREATE TABLE letters (
    id BIGSERIAL PRIMARY KEY,
    sender_name VARCHAR(100) NOT NULL,
    recipient_name VARCHAR(100) NOT NULL,
    exit_date DATE NOT NULL,
    exit_time TIME NOT NULL,
    return_date DATE NOT NULL,
    return_time TIME NOT NULL,
    destination VARCHAR(200) NOT NULL,
    purpose TEXT NOT NULL,
    companions VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 Setup

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd realtime-chat
   ```

2. **Setup Supabase**
   - Buat project di [Supabase](https://supabase.com)
   - Jalankan `supabase-setup.sql` di SQL Editor
   - Copy Supabase URL dan Anon Key
   - Update `js/config.js`:
     ```javascript
     export const SUPABASE_CONFIG = {
         url: 'YOUR_SUPABASE_URL',
         anonKey: 'YOUR_SUPABASE_ANON_KEY'
     };
     ```

3. **Deploy**
   - Netlify: Push ke GitHub dan connect
   - Atau deploy ke hosting lain

## 🎨 Design System

### Colors
- **Primary**: #667eea (Purple)
- **Primary Dark**: #5568d3
- **Success**: #10b981 (Green)
- **Error**: #ef4444 (Red)
- **Warning**: #f59e0b (Orange)

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 📱 Features Detail

### Landing Page
- Feature cards dengan icon
- Unread message badge
- Quick stats (total messages & letters)
- User badge showing current user

### Chat
- Real-time messaging dengan Supabase Realtime
- Message bubbles (sent/received)
- Read receipts (single/double check)
- Auto-scroll to latest message
- Textarea auto-resize
- Enter to send (Shift+Enter for newline)

### Izin Keluar
- Form dengan validation
- Auto-detect sender/recipient
- Letter preview
- Print functionality
- Save to database
- History of past letters

## 🔮 Future Enhancements

- [ ] Dark mode
- [ ] File/Image sharing in chat
- [ ] Voice messages
- [ ] Push notifications
- [ ] Message search
- [ ] Letter templates
- [ ] Export chat to PDF
- [ ] Calendar integration for izin keluar
- [ ] Multi-user support
- [ ] User profiles with avatars

## 📄 License

Private project for Rey & Annisa

## 💝 Made with Love

Built with love by Rey for Rey & Annisa 💕
