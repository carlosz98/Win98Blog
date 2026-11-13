// Fixed desktop layout: every icon has its own grid cell, so the desktop looks the same on every
// visit and window size (visitors can still drag icons around; a refresh puts them back).
// Each inner array is one column, top to bottom, ordered by what matters most to a visitor.
export const DESKTOP_COLUMNS = [
  // 1. The main stuff
  ['Project', 'Blog', 'DevFeed', 'Scrapbook', 'About', 'Resume', 'MyComputer'],
  // 2. Sign it, read it, explore it
  ['Games', 'Guestbook', 'Class Notes', 'Magazine', 'Cool Sites', 'Paint Gallery', 'Mail'],
  // 3. Music and extras
  ['Media Player', 'Winamp', 'MSN', 'TheOldNet', 'Ko-fi', 'My Specs', 'Portfolio'],
  // 4. Links and the shop
  ['Clasicos', 'Store'],
];

// Desktop folders and the programs inside them. Every load puts these programs back in their
// folder (like the fixed desktop layout above), so all visitors see the same tidy desktop.
// Nov 2026: Carlos kept only the Games folder; the Online and Programs folders were dropped.
export const DESKTOP_FOLDERS = {
  Games: ['Solitaire', 'MineSweeper', 'Doom', 'Space Invaders', 'Pinball'],
};
export const REMOVED_FOLDERS = ['Online', 'Programs'];

export const FOLDER_OF = Object.fromEntries(
  Object.entries(DESKTOP_FOLDERS).flatMap(([folder, names]) => names.map(name => [name, folder]))
);

// Apps hidden from the desktop. Their programs now live in the folders above, so nothing is hidden.
export const HIDDEN_APPS = [];

export const DESKTOP_ROWS = Math.max(...DESKTOP_COLUMNS.map(c => c.length));

export const DESKTOP_CELLS = Object.fromEntries(
  DESKTOP_COLUMNS.flatMap((names, col) => names.map((name, row) => [name, { col: col + 1, row: row + 1 }]))
);
