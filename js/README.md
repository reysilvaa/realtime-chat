# 📁 JavaScript Structure

Organized JavaScript modules by feature for better maintainability and scalability.

## 📂 Folder Structure

```
js/
├── core/              # Shared utilities & configuration
│   ├── config.js         - Supabase configuration
│   ├── dev-tools.js      - Development tools (user selector, query params)
│   └── utils.js          - Utility functions (date formatting, etc.)
│
├── chat/              # Chat feature
│   ├── main.js           - Entry point & initialization
│   ├── messages.js       - Message CRUD & Supabase realtime
│   ├── ui.js             - UI utilities (notifications, scroll, render)
│   └── user.js           - User detection logic
│
├── permit/            # Izin Keluar (Permit) feature
│   ├── main.js           - Entry point & initialization
│   ├── device.js         - Device detection & auto-fill
│   ├── dom.js            - DOM element selectors
│   ├── form.js           - Form validation & handlers
│   ├── letter.js         - Letter generation & templates
│   ├── storage.js        - LocalStorage operations
│   ├── supabase.js       - Database operations for letters
│   └── ui.js             - UI utilities (notifications, navigation)
│
└── landing/           # Landing page
    └── main.js           - Landing page logic & stats
```

## 🔗 Import Patterns

### Core Utilities (Shared across features)
```javascript
// From any feature folder
import { SUPABASE_CONFIG, getSupabaseClient } from '../core/config.js';
import { formatDate, formatDateTime } from '../core/utils.js';
import { showUserSelector, logDevInfo } from '../core/dev-tools.js';
```

### Feature-specific imports
```javascript
// Within chat feature
import { detectUser } from './user.js';
import { loadMessages } from './messages.js';

// Within permit feature
import { elements } from './dom.js';
import { generateLetter } from './letter.js';
```

## 📄 HTML Script References

### index.html (Landing page)
```html
<script type="module" src="js/landing/main.js"></script>
```

### chat.html
```html
<script type="module" src="js/chat/main.js"></script>
```

### izin-keluar.html
```html
<script type="module" src="js/permit/main.js"></script>
```

## 🎯 Module Responsibilities

### **core/** - Shared Infrastructure
- **config.js**: Supabase client setup, global configuration
- **dev-tools.js**: Development mode detection, user selector UI, query param handling
- **utils.js**: Pure utility functions (date formatting, string manipulation)

### **chat/** - Real-time Messaging
- **main.js**: App initialization, event listeners setup
- **messages.js**: Load/send messages, Supabase realtime subscriptions
- **ui.js**: Chat-specific UI (message bubbles, notifications, scroll)
- **user.js**: User detection based on device (Rey/Annisa)

### **permit/** - Surat Izin Keluar
- **main.js**: App initialization, event listeners, connection monitoring
- **device.js**: Device detection & auto-fill sender/recipient names
- **dom.js**: All DOM element references (centralized)
- **form.js**: Form validation, submission, preview, print
- **letter.js**: Letter HTML generation, template rendering
- **storage.js**: LocalStorage for form auto-save
- **supabase.js**: Database operations (save, load, history)
- **ui.js**: UI utilities (notifications, section navigation, status)

### **landing/** - Home Screen
- **main.js**: Landing page logic, stats loading, user detection

## 🔄 Data Flow

### Chat Feature
```
main.js
  ├─> user.js (detect user)
  ├─> messages.js (load/send)
  │    └─> core/config.js (Supabase client)
  ├─> ui.js (render messages)
  └─> core/dev-tools.js (dev mode)
```

### Permit Feature
```
main.js
  ├─> device.js (detect user)
  │    ├─> dom.js (form elements)
  │    └─> core/dev-tools.js (query params)
  ├─> form.js (handle submission)
  │    ├─> letter.js (generate letter)
  │    │    └─> core/utils.js (format dates)
  │    └─> supabase.js (save to DB)
  │         └─> core/config.js (Supabase client)
  ├─> storage.js (auto-save form)
  └─> ui.js (notifications, navigation)
```

### Landing Page
```
landing/main.js
  ├─> core/config.js (Supabase client)
  ├─> core/dev-tools.js (user selector, query params)
  └─> Load stats from messages & letters tables
```

## 🚀 Adding New Features

When adding a new feature:

1. Create new folder under `js/`
2. Create `main.js` as entry point
3. Create feature-specific modules
4. Import from `core/` for shared utilities
5. Update HTML to reference `js/<feature>/main.js`

Example:
```
js/
└── calendar/          # New feature
    ├── main.js
    ├── events.js
    └── ui.js
```

## 🧹 Code Organization Rules

1. **No Circular Dependencies**: Modules should have clear dependency hierarchy
2. **Shared Code in core/**: Don't duplicate utilities across features
3. **Feature Isolation**: Features should be self-contained when possible
4. **Single Responsibility**: Each module should have one clear purpose
5. **Consistent Naming**: 
   - `main.js` for entry points
   - `ui.js` for UI utilities
   - `<feature>.js` for core feature logic

## 📊 File Statistics

- **Total JS Files**: 15
- **Features**: 3 (chat, permit, landing)
- **Shared Modules**: 3 (core)
- **Lines of Code**: ~2,500 (estimated)

## 🔍 Finding Files

Use these commands to explore:

```bash
# List all JS files
find js -name "*.js" | sort

# Find imports from core
grep -r "from '../core" js/

# Find all main.js entry points
find js -name "main.js"

# Count lines per folder
find js/core -name "*.js" -exec wc -l {} +
find js/chat -name "*.js" -exec wc -l {} +
find js/permit -name "*.js" -exec wc -l {} +
```

## 🐛 Debugging

### Import Path Issues
If you get import errors:
1. Check relative paths (`../core/` vs `./`)
2. Verify file exists: `ls js/core/config.js`
3. Check browser console for 404 errors

### Module Not Found
```
Error: Failed to resolve module specifier
```
- Make sure path starts with `./` or `../`
- Verify `.js` extension is included
- Check file path is correct

## 📚 Resources

- [ES6 Modules Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [JavaScript Project Structure Best Practices](https://github.com/elsewhencode/project-guidelines)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

---

**Last Updated**: 2025-10-29
**Maintainer**: Rey
