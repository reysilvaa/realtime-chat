# 🧪 Testing Guide - Device Detection

Guide lengkap untuk testing fitur device detection tanpa perlu iPhone/Android fisik.

## 🎯 Metode Testing

### 1. **Development Mode User Selector** ⭐ (Recommended)

Aplikasi otomatis mendeteksi localhost dan menampilkan floating user selector.

**Cara Pakai:**
1. Jalankan di localhost atau dengan `?dev=true`
2. Lihat floating selector di bottom-right (warna merah)
3. Pilih user: Rey atau Annisa
4. Aplikasi akan reload dengan user yang dipilih

**Contoh:**
```
http://localhost:8080/
http://localhost:8080/chat.html
http://your-domain.com/?dev=true
```

---

### 2. **Query Parameter Override** 🔗

Gunakan query parameter untuk force user tertentu.

**Cara Pakai:**
```
?user=rey      → Login sebagai Rey
?user=annisa   → Login sebagai Annisa
```

**Contoh URL:**
```
http://localhost:8080/?user=annisa
http://localhost:8080/chat.html?user=rey
http://localhost:8080/izin-keluar.html?user=annisa
```

**Testing Scenario:**
```bash
# Test as Rey
open http://localhost:8080/?user=rey

# Test as Annisa
open http://localhost:8080/?user=annisa

# Test chat as Rey
open http://localhost:8080/chat.html?user=rey

# Test chat as Annisa in new tab/window
open http://localhost:8080/chat.html?user=annisa
```

---

### 3. **Chrome DevTools Device Emulation** 📱

Simulate iOS/Android device di Chrome.

**Cara Pakai:**
1. Buka Chrome DevTools (`F12` atau `Cmd+Option+I`)
2. Click icon **Toggle Device Toolbar** (`Cmd+Shift+M`)
3. Pilih device:
   - **iPhone 12/13/14** → User = Annisa
   - **Pixel 5/Galaxy S20** → User = Rey
   - **Desktop** → User = Rey (default)
4. Reload page (`Cmd+R`)

**Screenshot:**
```
DevTools > Device Toolbar > Select Device:
├── iPhone 14 Pro Max     → Annisa
├── iPhone SE             → Annisa  
├── iPad Air              → Annisa
├── Pixel 5               → Rey
├── Galaxy S20            → Rey
└── Desktop (Responsive)  → Rey
```

---

### 4. **User Agent Override di Console** 🔧

Manual override user agent untuk testing cepat.

**Cara Pakai:**
1. Buka Console DevTools
2. Run salah satu command:

```javascript
// Simulate iPhone (Annisa)
Object.defineProperty(navigator, 'userAgent', {
  get: () => 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
});
location.reload();

// Simulate Android (Rey)
Object.defineProperty(navigator, 'userAgent', {
  get: () => 'Mozilla/5.0 (Linux; Android 11; Pixel 5)'
});
location.reload();
```

⚠️ **Note:** User agent override via console tidak persistent setelah reload.

---

### 5. **Browser Extension - User Agent Switcher** 🔌

Untuk testing lebih persisten.

**Recommended Extensions:**
- [User-Agent Switcher (Chrome)](https://chrome.google.com/webstore/detail/user-agent-switcher/bhchdcejhohfmigjafbampogmaanbfkg)
- [User-Agent Switcher (Firefox)](https://addons.mozilla.org/en-US/firefox/addon/user-agent-string-switcher/)

**Preset User Agents:**

```
iOS (Annisa):
Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15

Android (Rey):
Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36

Desktop (Rey):
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36
```

---

## 🧪 Testing Scenarios

### Scenario 1: Test Chat Real-time

**Setup:**
1. Buka 2 browser windows/tabs
2. Window 1: `http://localhost:8080/chat.html?user=rey`
3. Window 2: `http://localhost:8080/chat.html?user=annisa`
4. Kirim pesan dari Window 1 (Rey)
5. Verify pesan muncul di Window 2 (Annisa) secara real-time

**Expected:**
- Rey's messages: Right side, blue bubble
- Annisa's messages: Left side, white bubble
- Read receipts update otomatis

---

### Scenario 2: Test Izin Keluar

**Setup:**
1. `http://localhost:8080/izin-keluar.html?user=rey`
2. Isi form dan submit
3. Check database: sender_name = 'Rey', recipient_name = 'Annisa'
4. Reload dengan `?user=annisa`
5. Check form: sender_name = 'Annisa', recipient_name = 'Rey'

---

### Scenario 3: Test Landing Page Stats

**Setup:**
1. Open `http://localhost:8080/?user=rey`
2. Check user badge shows "Rey"
3. Check chat badge untuk unread messages
4. Switch user dengan dev selector
5. Verify stats update

---

## 🔍 Debugging Tips

### Check Current User
Open Console dan run:
```javascript
// Check current user agent
console.log(navigator.userAgent);

// Check query params
console.log(new URLSearchParams(window.location.search).get('user'));
```

### Force Dev Mode
Tambahkan `?dev=true` di URL untuk force enable dev tools:
```
http://your-production-site.com/?dev=true
```

### Console Logs
Di development mode, check console untuk:
- Current user info
- Device detection result
- Testing tips

---

## 🚀 Local Development Setup

### 1. Simple HTTP Server

```bash
# Python 3
python3 -m http.server 8080

# Node.js (http-server)
npx http-server -p 8080

# PHP
php -S localhost:8080
```

### 2. Live Server (VS Code)

1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"
4. Access: `http://127.0.0.1:5500`

### 3. Netlify Dev (Recommended for production-like testing)

```bash
npm install -g netlify-cli
netlify dev
```

---

## 📝 Testing Checklist

### Landing Page
- [ ] User badge shows correct name
- [ ] Dev selector appears in localhost
- [ ] Query param `?user=rey` works
- [ ] Query param `?user=annisa` works
- [ ] Stats load correctly
- [ ] Chat badge shows unread count

### Chat
- [ ] User detection works
- [ ] Messages send successfully
- [ ] Real-time updates work
- [ ] Read receipts update
- [ ] Message bubbles correct position (sent/received)
- [ ] Can switch between users with query param

### Izin Keluar
- [ ] Auto-detect sender/recipient
- [ ] Form saves with correct names
- [ ] Can override with query param
- [ ] Letter preview shows correct names
- [ ] History loads for correct user

---

## 🎭 Production Testing

For testing di production tanpa dev selector:

```bash
# Test as Rey
https://your-domain.com/?user=rey

# Test as Annisa
https://your-domain.com/?user=annisa

# Disable override (use real device detection)
https://your-domain.com/
```

---

## 💡 Pro Tips

1. **Use Incognito/Private browsing** untuk avoid localStorage cache
2. **Use different browsers** untuk simulate 2 users simultaneously
3. **Check Network tab** untuk verify Supabase API calls
4. **Check Application > Local Storage** untuk inspect saved data
5. **Use Console logs** untuk debug user detection logic

---

## 🐛 Common Issues

### Issue: Dev selector tidak muncul
**Solution:** 
- Check hostname is localhost or 127.0.0.1
- Or add `?dev=true` to URL

### Issue: Query param tidak bekerja
**Solution:**
- Make sure format correct: `?user=rey` (lowercase)
- Clear browser cache
- Check console for errors

### Issue: Real-time tidak update
**Solution:**
- Check Supabase Realtime is enabled
- Run SQL: `ALTER PUBLICATION supabase_realtime ADD TABLE messages;`
- Check network connection

---

## 📞 Support

Jika ada issues, check:
1. Browser Console untuk error messages
2. Network tab untuk failed requests
3. Supabase Dashboard > Table Editor
4. Supabase Dashboard > API Logs

---

Happy Testing! 🎉
