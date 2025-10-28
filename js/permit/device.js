import { elements } from './dom.js';
import { showNotification } from './ui.js';
import { getUserFromQuery } from '../core/dev-tools.js';

export function detectDeviceAndSetName() {
    let detectedSenderName = '';
    let detectedRecipientName = '';
    let deviceType = '';
    
    // Check for manual override
    const manualUser = getUserFromQuery();
    if (manualUser) {
        detectedSenderName = manualUser.userName;
        detectedRecipientName = manualUser.userName === 'Rey' ? 'Annisa' : 'Rey';
        deviceType = 'Manual Override';
    } else {
        // Auto-detect from user agent
        const userAgent = navigator.userAgent.toLowerCase();
        
        if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
            detectedSenderName = 'Annisa';
            detectedRecipientName = 'Rey';
            deviceType = 'iOS';
        } else if (userAgent.includes('android')) {
            detectedSenderName = 'Rey';
            detectedRecipientName = 'Annisa';
            deviceType = 'Android';
        } else {
            detectedSenderName = 'Rey';
            detectedRecipientName = 'Annisa';
            deviceType = 'Desktop';
        }
    }
    
    elements.senderName.value = detectedSenderName;
    elements.recipientName.value = detectedRecipientName;
    
    showNotification(`Device terdeteksi: ${deviceType} - ${detectedSenderName} → ${detectedRecipientName}`, 'success');
    
    return { 
        senderName: detectedSenderName, 
        recipientName: detectedRecipientName,
        device: deviceType 
    };
}
