export interface User {
  userName: 'Rey' | 'Annisa';
  device: string;
}

export interface Message {
  id: number;
  sender_name: string;
  recipient_name: string;
  message: string;
  created_at: string;
  read_at: string | null;
}

export interface Letter {
  id?: number;
  sender_name: string;
  recipient_name: string;
  exit_date: string;
  exit_time: string;
  return_date: string;
  return_time: string;
  destination: string;
  purpose: string;
  companions?: string;
  created_at?: string;
}

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  message: string;
  type: NotificationType;
  id: number;
}

export interface Stats {
  totalMessages: number;
  totalLetters: number;
  unreadMessages: number;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}
