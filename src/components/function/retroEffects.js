// Small retro touches shared across the desktop.

let busyTimer = null;

// Win98 hourglass cursor for a moment while an app "loads".
export function showBusyCursor(ms = 700) {
  const root = document.documentElement;
  root.classList.add('win-busy');
  clearTimeout(busyTimer);
  busyTimer = setTimeout(() => root.classList.remove('win-busy'), ms);
}
