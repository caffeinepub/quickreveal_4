export interface InAppNotification {
  id: string;
  type: string;
  titre: string;
  message: string;
  lu: boolean;
  timestamp: number;
}

const LOCAL_KEY = 'nexus_notifications';

export function getNotifications(): InAppNotification[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as InAppNotification[];
  } catch {
    return [];
  }
}

export function saveNotifications(notifs: InAppNotification[]): void {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(notifs));
}

export function markRead(notificationId: string): void {
  const notifs = getNotifications().map((n) =>
    n.id === notificationId ? { ...n, lu: true } : n
  );
  saveNotifications(notifs);
}

export function markAllRead(): void {
  const notifs = getNotifications().map((n) => ({ ...n, lu: true }));
  saveNotifications(notifs);
}

export function addNotification(notif: Omit<InAppNotification, 'id' | 'timestamp'>): void {
  const notifs = getNotifications();
  notifs.unshift({
    ...notif,
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    timestamp: Date.now(),
  });
  saveNotifications(notifs.slice(0, 50));
}
