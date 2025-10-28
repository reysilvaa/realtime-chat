import { DEV_MODE } from '$lib/config';
import type { User } from '$lib/types';

export function logDevInfo(currentUser: User): void {
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
