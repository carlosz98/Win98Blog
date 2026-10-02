// Windows 8 style "live tile" faces: each tile periodically slides up a text face.
import iconInfo from '../../icon.json';

const projects = iconInfo.filter(item => item.folderId === 'Project').map(p => p.name);

// Each entry is a list of faces; a face is a big line and an optional small line,
// or a function that builds one each time it is shown.
export const LIVE_FACES = {
  About:       [{ big: 'Carlos Zabala', small: 'Programmer · New York City' }, { big: 'C++ · Java · C#', small: 'Unity · UE5 · React' }],
  Resume:      [{ big: 'Open to work', small: 'On site in NYC or remote' }],
  ResumeFile:  [{ big: 'Résumé.pdf', small: 'Click to open' }],
  Project:     projects.map((name, i) => ({ big: name, small: `Project ${i + 1} of ${projects.length}` })),
  Github:      [{ big: `${projects.length} repos`, small: 'github.com/carlosz98' }],
  Mail:        [{ big: 'Say hi 👋', small: 'czabala98@gmail.com' }],
  MSN:         [{ big: 'CarlosBot', small: 'Online · ask me anything' }],
  IE:          [{ big: 'Surf the web', small: 'like it\'s 1998' }],
  Blog:        [{ big: "Charly's Blog", small: 'Made with Framer' }],
  Portfolio:   [{ big: 'My Portfolio', small: 'carlosz98.github.io' }],
  TheOldNet:   [{ big: 'The Old Net', small: 'Retro webring' }],
  Clasicos:    [{ big: 'Clásicos Básicos', small: 'Classic sites' }],
  'Ko-fi':     [{ big: '☕ Buy me a coffee', small: 'ko-fi.com/carloszabala' }],
  MineSweeper: [{ big: '💣 Minesweeper', small: 'Can you clear the board?' }],
  Settings:    [{ big: 'Try CRT mode', small: 'Settings → Display' }],
  Run:         [{ big: 'Psst...', small: 'type "matrix"' }],
  MyComputer:  [{ big: 'C:\\', small: '98% full of nostalgia' }],
  'Random BG': [{ big: 'New wallpaper?', small: 'Click to shuffle' }],
  Patch:       [{ big: "What's new", small: 'Read the patch notes' }],
  RecycleBin:  [{ big: 'Nothing to see', small: 'Probably...' }],
  Utility:     [{ big: 'Utilities', small: 'Paint · Task Manager · more' }],
  TaskManager: [() => ({ big: `CPU ${Math.floor(Math.random() * 12) + 1}%`, small: `RAM ${Math.floor(Math.random() * 20) + 40}% · all good` })],
  Store:       [{ big: '🚧 Coming soon', small: 'Under construction' }],
  News:        [{ big: '🎮 Gaming news', small: 'Fresh headlines inside' }],
  Note:        [{ big: 'Sticky notes', small: 'Jot something down' }],
  PixelPic:    [{ big: 'Pixel Pic', small: 'Turn photos into pixel art' }],
};

export function faceAt(content, n) {
  const faces = LIVE_FACES[content];
  if (!faces || !faces.length) return null;
  const face = faces[n % faces.length];
  return typeof face === 'function' ? face() : face;
}
