import { browser } from '$app/environment';
import type { User } from '$lib/types';

export function getUserFromQuery(): User | null {
  if (!browser) return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const user = urlParams.get('user');
  
  if (user === 'rey' || user === 'Rey') {
    return { userName: 'Rey', device: 'Manual Override' };
  } else if (user === 'annisa' || user === 'Annisa') {
    return { userName: 'Annisa', device: 'Manual Override' };
  }
  
  return null;
}

export function detectUser(): User {
  const manualUser = getUserFromQuery();
  if (manualUser) return manualUser;
  
  if (!browser) {
    return { userName: 'Rey', device: 'Server' };
  }
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
    return { userName: 'Annisa', device: 'iOS' };
  } else if (userAgent.includes('android')) {
    return { userName: 'Rey', device: 'Android' };
  } else {
    return { userName: 'Rey', device: 'Desktop' };
  }
}

export function getRecipientName(userName: string): 'Rey' | 'Annisa' {
  return userName === 'Rey' ? 'Annisa' : 'Rey';
}
