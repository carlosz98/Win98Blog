// Everything shown in the Cool Sites window and the IE Favorites menu.
// Edit these lists to change what visitors see; no other file needs to change.
// Each `button` is drawn as a classic 88x31 web button (see button88.js).

export const SITE_URL = 'https://carlosz98.github.io/Win98Blog/';
export const MY_BUTTON = { bg: ['#000080', '#008080'], fg: '#ffffff', accent: '#ffff00', text: 'CARLOS', sub: 'win98 blog', flag: true };

// Bookmarks, grouped in folders. The same folders show up under Favorites in the IE window.
export const BOOKMARK_FOLDERS = [
  {
    name: 'Retro Web',
    sites: [
      { name: 'TheOldNet', url: 'https://theoldnet.com/', note: 'Browse the web like it is 1998.', button: { bg: ['#202020', '#505050'], fg: '#7CFC00', accent: '#ffffff', text: 'TheOldNet', sub: 'time machine' } },
      { name: 'Clasicos Basicos', url: 'https://clasicosbasicos.org/', note: 'Classic software and games.', button: { bg: ['#7a0000', '#c02020'], fg: '#ffffff', accent: '#ffd700', text: 'CLASICOS', sub: 'basicos' } },
      { name: "Cameron's World", url: 'https://www.cameronsworld.net/', note: 'A collage of old Geocities pages.', button: { bg: ['#ff66cc', '#6600cc'], fg: '#ffff66', accent: '#ffffff', text: "CAMERON'S", sub: 'world' } },
      { name: 'Windows 93', url: 'https://www.windows93.net/', note: 'A fake OS full of jokes.', button: { bg: ['#008080', '#00b0b0'], fg: '#ffffff', accent: '#000000', text: 'WINDOWS 93', sub: 'try it' } },
      { name: 'Space Jam (1996)', url: 'https://www.spacejam.com/1996/', note: 'The original 1996 movie site, still online.', button: { bg: ['#000000', '#1a1a5a'], fg: '#ff9900', accent: '#ffffff', text: 'SPACE JAM', sub: '1996' } },
      { name: 'Internet Archive', url: 'https://archive.org/', note: 'Old sites, games and software, saved forever.', button: { bg: ['#f0f0f0', '#b0b0b0'], fg: '#000000', accent: '#333333', text: 'ARCHIVE', sub: '.org' } },
    ],
  },
  {
    name: 'Dev',
    sites: [
      { name: 'GitHub', url: 'https://github.com/carlosz98', note: 'My code lives here.', button: { bg: ['#24292e', '#000000'], fg: '#ffffff', accent: '#9be9a8', text: 'GITHUB', sub: 'carlosz98' } },
      { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/', note: 'Where I look up HTML, CSS and JS.', button: { bg: ['#000000', '#222222'], fg: '#ffffff', accent: '#83d0f2', text: 'MDN', sub: 'web docs' } },
      { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', note: 'Free lessons for everything web.', button: { bg: ['#0a0a23', '#1b1b32'], fg: '#ffffff', accent: '#f1be32', text: 'freeCodeCamp', sub: 'learn' } },
      { name: 'Neocities', url: 'https://neocities.org/', note: 'Free hosting for personal sites.', button: { bg: ['#e93250', '#ff7a8a'], fg: '#ffffff', accent: '#fff3a0', text: 'NEOCITIES', sub: 'make a site' } },
    ],
  },
  {
    name: 'Games',
    sites: [
      { name: 'itch.io', url: 'https://itch.io/', note: 'Indie games, lots of them free.', button: { bg: ['#fa5c5c', '#c03030'], fg: '#ffffff', accent: '#ffffff', text: 'itch.io', sub: 'indie games' } },
      { name: 'Newgrounds', url: 'https://www.newgrounds.com/', note: 'The home of Flash games.', button: { bg: ['#1a1a1a', '#3a2a00'], fg: '#ff9a00', accent: '#ffffff', text: 'NEWGROUNDS', sub: 'everything' } },
    ],
  },
];

// Fan pages. `console` is an id from consoleSprites.js, drawn as pixel art.
export const SHRINES = [
  {
    id: 'ps2', console: 'ps2', title: 'The PlayStation 2 Shrine',
    facts: [
      'Released in 2000 and sold over 155 million units, the best-selling console ever.',
      'It could play DVDs, which made it a lot of people’s first DVD player.',
      'Sony kept making it until 2013.',
    ],
    why: 'The console I spent the most hours on growing up.',
  },
  {
    id: 'gamecube', console: 'gamecube', title: 'The GameCube Shrine',
    facts: [
      'Released in 2001 and used small 8 cm discs instead of full-size ones.',
      'It has a handle on the back so you could carry it to a friend’s house.',
      'The startup sound changes if you hold Z on the controller.',
    ],
    why: 'Smash Bros. nights with friends.',
  },
  {
    id: 'zune', console: 'zune', title: 'The Zune 30GB Shrine',
    facts: [
      'Microsoft’s music player, released in November 2006.',
      'It could send songs to other Zunes over Wi-Fi, called "squirting".',
      'The brown one is the one everybody remembers.',
    ],
    why: 'My music went everywhere with me on this.',
  },
];

// Blogs, channels and sites Carlos reads or watches.
export const BLOGROLL = [
  { name: 'CSS-Tricks', url: 'https://css-tricks.com/', why: 'Clear CSS guides when I get stuck.' },
  { name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/', why: 'Longer articles on web design.' },
  { name: 'Fireship (YouTube)', url: 'https://www.youtube.com/@Fireship', why: 'Fast, funny dev videos.' },
  { name: 'Digital Foundry (YouTube)', url: 'https://www.youtube.com/@DigitalFoundry', why: 'Deep dives on game tech and retro consoles.' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com/', why: 'What developers are talking about today.' },
];

// Friends and neighbors. Add a friend's site here with their own 88x31 button.
export const NEIGHBORS = [
  { name: "Charly's Blog", url: 'https://charlysblog.framer.website/', note: 'My other blog.', button: { bg: ['#4b0082', '#9b30ff'], fg: '#ffffff', accent: '#ffd1ff', text: "CHARLY'S", sub: 'blog' } },
  { name: 'My Portfolio', url: 'https://carlosz98.github.io/MyPortFolio/', note: 'My projects and resume.', button: { bg: ['#003366', '#0066cc'], fg: '#ffffff', accent: '#aee6ff', text: 'PORTFOLIO', sub: 'carlos z.' } },
  { name: 'Ko-fi', url: 'https://ko-fi.com/carloszabala', note: 'Buy me a coffee.', button: { bg: ['#29abe0', '#1b7fb0'], fg: '#ffffff', accent: '#ff5e5b', text: 'KO-FI', sub: 'buy a coffee' } },
];
