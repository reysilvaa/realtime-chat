// Development Tools untuk Testing
export const DEV_MODE = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' ||
                        window.location.search.includes('dev=true');

export function getUserFromQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');
    
    if (user === 'rey' || user === 'Rey') {
        return { userName: 'Rey', device: 'Manual Override' };
    } else if (user === 'annisa' || user === 'Annisa') {
        return { userName: 'Annisa', device: 'Manual Override' };
    }
    
    return null;
}

export function showUserSelector(currentUser, onUserChange) {
    if (!DEV_MODE) return;
    
    const selector = document.createElement('div');
    selector.className = 'dev-user-selector';
    selector.innerHTML = `
        <div class="dev-selector-content">
            <span class="dev-label">🔧 DEV MODE</span>
            <select id="devUserSelect" class="dev-select">
                <option value="rey" ${currentUser.userName === 'Rey' ? 'selected' : ''}>Rey (Android/Desktop)</option>
                <option value="annisa" ${currentUser.userName === 'Annisa' ? 'selected' : ''}>Annisa (iOS)</option>
            </select>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .dev-user-selector {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
            color: white;
            padding: 12px 16px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
            z-index: 9999;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 12px;
            animation: devPulse 2s infinite;
        }
        
        @keyframes devPulse {
            0%, 100% { box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4); }
            50% { box-shadow: 0 4px 20px rgba(255, 107, 107, 0.6); }
        }
        
        .dev-selector-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .dev-label {
            font-weight: 700;
            font-size: 11px;
            letter-spacing: 0.5px;
        }
        
        .dev-select {
            background: white;
            color: #333;
            border: none;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            outline: none;
        }
        
        .dev-select:hover {
            background: #f8f9fa;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(selector);
    
    // Handle user change
    const select = document.getElementById('devUserSelect');
    select.addEventListener('change', (e) => {
        const newUser = e.target.value === 'rey' ? 'Rey' : 'Annisa';
        if (onUserChange) {
            onUserChange({ userName: newUser, device: 'Dev Override' });
        }
        
        // Reload with query param
        const url = new URL(window.location);
        url.searchParams.set('user', e.target.value);
        window.location.href = url.toString();
    });
}

export function logDevInfo(currentUser) {
    if (!DEV_MODE) return;
    
    console.log('%c🔧 DEVELOPMENT MODE', 'background: #ff6b6b; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold;');
    console.log('Current User:', currentUser);
    console.log('');
    console.log('Testing Tips:');
    console.log('1. Use Chrome DevTools > Device Toolbar untuk simulate iOS/Android');
    console.log('2. Use query parameter: ?user=rey atau ?user=annisa');
    console.log('3. Use dev selector di bottom-right');
    console.log('');
    console.log('User Agent:', navigator.userAgent);
}
