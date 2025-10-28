import { writable } from 'svelte/store';
import { detectUser } from '$lib/utils/userDetection';
import type { User } from '$lib/types';

function createUserStore() {
  const { subscribe, set, update } = writable<User | null>(null);
  
  return {
    subscribe,
    init: () => {
      const user = detectUser();
      set(user);
      return user;
    },
    set,
    update
  };
}

export const currentUser = createUserStore();
