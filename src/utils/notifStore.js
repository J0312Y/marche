/**
 * Shared notification store
 * PushBanner writes here, NotifScr reads from here
 */
const store = {
  items: [],
  listeners: new Set(),
};

export function addNotification(notif) {
  const item = {
    id: "push-" + Date.now(),
    icon: notif.icon || "🔔",
    title: notif.title || "Lamuka Market",
    body: notif.body || notif,
    time: new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }),
    date: "Aujourd'hui",
    read: false,
    fromPush: true,
  };
  store.items.unshift(item);
  store.listeners.forEach(fn => fn([...store.items]));
}

export function getNotifications() {
  return store.items;
}

export function onNotifChange(fn) {
  store.listeners.add(fn);
  return () => store.listeners.delete(fn);
}

export function markPushRead(id) {
  store.items = store.items.map(n => n.id === id ? { ...n, read: true } : n);
  store.listeners.forEach(fn => fn([...store.items]));
}

export function markAllRead() {
  store.items = store.items.map(n => ({ ...n, read: true }));
  store.listeners.forEach(fn => fn([...store.items]));
}
