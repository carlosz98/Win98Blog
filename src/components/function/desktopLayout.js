// Fixed desktop layout: every icon has its own grid cell, so the desktop looks the same on every
// visit and window size (visitors can still drag icons around; a refresh puts them back).
// Each inner array is one column, top to bottom, ordered by what matters most to a visitor.
export const DESKTOP_COLUMNS = [
  // 1. The main stuff (Nov 2026: Carlos simplified the desktop)
  ['Project', 'Blog', 'DevFeed', 'Scrapbook', 'About', 'Resume'],
  // 2. Everything else lives in these folders
  ['MyComputer', 'Games', 'Online', 'Programs'],
];

// Desktop folders and the programs inside them. Every load puts these programs back in their
// folder (like the fixed desktop layout above), so all visitors see the same tidy desktop.
export const DESKTOP_FOLDERS = {
  Games: ['Solitaire', 'MineSweeper', 'Doom', 'Space Invaders', 'Pinball'],
  Online: ['TheOldNet', 'Clasicos', 'Ko-fi', 'Cool Sites', 'Portfolio', 'Guestbook', 'Mail', 'MSN'],
  Programs: ['Winamp', 'Media Player', 'Magazine', 'Paint Gallery', 'Class Notes', 'My Specs', 'Store'],
};

export const FOLDER_OF = Object.fromEntries(
  Object.entries(DESKTOP_FOLDERS).flatMap(([folder, names]) => names.map(name => [name, folder]))
);

// Apps hidden from the desktop. Their programs now live in the folders above, so nothing is hidden.
export const HIDDEN_APPS = [];

export const DESKTOP_ROWS = Math.max(...DESKTOP_COLUMNS.map(c => c.length));

export const DESKTOP_CELLS = Object.fromEntries(
  DESKTOP_COLUMNS.flatMap((names, col) => names.map((name, row) => [name, { col: col + 1, row: row + 1 }]))
);
