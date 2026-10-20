// Fixed desktop layout: every icon has its own grid cell, so the desktop looks the same on every
// visit and window size (visitors can still drag icons around; a refresh puts them back).
// Each inner array is one column, top to bottom, ordered by what matters most to a visitor.
export const DESKTOP_COLUMNS = [
  // 1. Carlos: work, resume, contact
  ['Project', 'Resume', 'About', 'Mail', 'Portfolio', 'Blog', 'DevFeed'],
  // 2. Sign it, read it, explore it
  ['Guestbook', 'Class Notes', 'Scrapbook', 'Magazine', 'Cool Sites', 'Visitor Map', 'Paint Gallery'],
  // 3. Music and games
  ['Media Player', 'Winamp', 'MSN', 'Solitaire', 'MineSweeper', 'Doom', 'Pinball'],
  // 4. Extras
  ['Space Invaders', 'TheOldNet', 'Clasicos', 'Ko-fi', 'Store', 'My Specs', 'MyComputer'],
];

export const DESKTOP_ROWS = Math.max(...DESKTOP_COLUMNS.map(c => c.length));

export const DESKTOP_CELLS = Object.fromEntries(
  DESKTOP_COLUMNS.flatMap((names, col) => names.map((name, row) => [name, { col: col + 1, row: row + 1 }]))
);
