import { getUserFromQuery } from '../core/dev-tools.js';

// User detection based on device
export function detectUser() {
    // Check for manual override via query parameter
    const manualUser = getUserFromQuery();
    if (manualUser) {
        return manualUser;
    }
    
    // Auto-detect from user agent
    const userAgent = navigator.userAgent.toLowerCase();
    let userName = '';
    let device = '';
    
    if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
        userName = 'Annisa';
        device = 'iOS';
    } else if (userAgent.includes('android')) {
        userName = 'Rey';
        device = 'Android';
    } else {
        userName = 'Rey';
        device = 'Desktop';
    }
    
    return { userName, device };
}
