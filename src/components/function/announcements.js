// Progress posts Claude writes for Carlos. They publish themselves to DevFeed and
// the Scrapbook the next time Carlos is signed in as admin (only he can post),
// once per browser, and never again if he deletes them afterwards on that browser.
import { devfeedStore } from './devfeedStore';
import { PAST_PROJECT_POSTS } from './pastProjects';

const SITE = 'https://carlosz98.github.io/Win98Blog/';
const DONE_KEY = 'announced_v1';

const ANNOUNCEMENTS = [
  {
    key: 'magazine-devfeed',
    collection: 'devfeed_posts',
    data: {
      title: 'Magazine.exe: a 3D game mag on the desktop',
      body: 'New app! A retro desk scene with an early-2000s game magazine lying on the table. Click it and it flies to the center, riffles through every page, then you flip through soft, bendy paper pages. 24 posters of game heroes x 90s sodas so far. Poster art by @mamonoworld.',
      tags: ['#React', '#CSS3D', '#Animation', '#RetroUI'],
      media: `${SITE}progress/magazine-flip.gif`,
      project: 'Win98Blog',
      likes: 0,
      likedBy: [],
      comments: [],
    },
  },
  // Scrapbook shows newest first, so these are created last-to-first.
  {
    key: 'magazine-scrap-4',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/magazine-4.jpg`, tag: 'magazine', caption: 'Step 4: soft pages that curl like real paper when they turn.' },
  },
  {
    key: 'magazine-scrap-3',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/magazine-3.jpg`, tag: 'magazine', caption: 'Step 3: it riffles through all 24 posters, then back to page one.' },
  },
  {
    key: 'magazine-scrap-2',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/magazine-2.jpg`, tag: 'magazine', caption: 'Step 2: click it and it flies off the desk. Early-2000s cover, free demo disc included.' },
  },
  {
    key: 'magazine-scrap-1',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/magazine-1.jpg`, tag: 'magazine', caption: 'Step 1: the desk. Carlos Monthly is just lying there…' },
  },
  {
    key: 'magazine-scrap-gif',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/magazine-flip.gif`, tag: 'magazine', caption: 'Working on a 3D magazine for the site. Pick it up off the desk and flip through!' },
  },
  // New projects, Oct 11 2026: The MP3 Wizard and PetHome Vet (newest first, so created last-to-first).
  {
    key: 'mp3-wizard-scrap-app',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/mp3-wizard-app.jpg`, tag: 'projects', caption: 'The MP3 Wizard: paste a Spotify playlist, get tagged MP3s with album art for my Zune 30GB.' },
  },
  {
    key: 'mp3-wizard-scrap-gif',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/past/mp3-wizard.gif`, tag: 'projects', caption: 'Please hold, the wizard is installing. He also comments on every download.' },
  },
  {
    key: 'pethome-vet-scrap-book',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/pethome-book.jpg`, tag: 'projects', caption: 'PetHome Vet: booking a visit takes 4 short steps, with a live summary on the side.' },
  },
  {
    key: 'pethome-vet-scrap-gif',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/past/pethome-vet.gif`, tag: 'projects', caption: 'New project: PetHome Vet, my pet adoption site rebuilt as a vet clinic. Plain HTML, CSS and JS.' },
  },
  // One DevFeed post per earlier project, newest landing on top.
  ...PAST_PROJECT_POSTS.map(({ key, media, video, ...rest }) => ({
    key,
    collection: 'devfeed_posts',
    data: {
      ...rest,
      media: media ? `${SITE}progress/past/${media}` : null,
      video,
      mediaFit: 'full',
      likes: 0,
      likedBy: [],
      comments: [],
    },
  })),
  // RetroHub update, Oct 20 2026: new launch intro (album page post goes after it).
  {
    key: 'retrohub-intro-devfeed',
    collection: 'devfeed_posts',
    data: {
      title: 'RetroHub: a new all-ASCII launch intro',
      body: 'RetroHub has a new intro, and every frame is made of text characters. First a little campfire in an isometric forest clearing, lit only by the fire, with my credit "by doncarlis" decoding underneath. Then a quick boot screen, and the RETRO HUB logo glitches in, hits with a shockwave and sparks, and lands on a white scrapbook card: WELCOME, PLAYER, PRESS START. It all runs on one Compose Canvas, drawing a grid of monospace characters every frame. Tap to skip.',
      tags: ['#Android', '#Kotlin', '#JetpackCompose', '#ASCII', '#Animation'],
      media: `${SITE}progress/retrohub/retrohub-intro-duo.gif`,
      mediaFit: 'full',
      project: 'RetroHub',
      likes: 0,
      likedBy: [],
      comments: [],
    },
  },
  // Scrapbook shows newest first, so these are created last-to-first.
  {
    key: 'retrohub-intro-scrap-4',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/retrohub/intro-title.jpg`, tag: 'retrohub', caption: 'RetroHub intro, step 4: the logo lands on a scrapbook card. WELCOME, PLAYER. Press start!' },
  },
  {
    key: 'retrohub-intro-scrap-3',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/retrohub/intro-impact.jpg`, tag: 'retrohub', caption: 'Step 3: RETRO HUB decodes out of random symbols and hits with a shockwave.' },
  },
  {
    key: 'retrohub-intro-scrap-2',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/retrohub/intro-credit.jpg`, tag: 'retrohub', caption: 'Step 2: "by doncarlis" types itself out under the fire.' },
  },
  {
    key: 'retrohub-intro-scrap-1',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/retrohub/intro-campfire.jpg`, tag: 'retrohub', caption: 'Step 1: a campfire in a tiny forest clearing. Only what the fire lights up is visible.' },
  },
  {
    key: 'retrohub-intro-scrap-title-gif',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/retrohub/retrohub-intro-title.gif`, tag: 'retrohub', caption: 'Part 2 of the RetroHub intro: boot screen, glitchy logo, impact, PRESS START.' },
  },
  {
    key: 'retrohub-intro-scrap-sting-gif',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/retrohub/retrohub-intro-sting.gif`, tag: 'retrohub', caption: 'New RetroHub launch intro, all made of ASCII characters. Part 1: the campfire.' },
  },
  // RetroHub update, Oct 20 2026: the Albums page redesign.
  {
    key: 'retrohub-albums-devfeed',
    collection: 'devfeed_posts',
    data: {
      title: 'RetroHub: the Albums page, redesigned',
      body: 'The Albums page used to look like a different app, with neon glows and gradients. Now it matches the rest of RetroHub: white cards with ink borders, hard offset shadows and the green palette. Every album is a record sleeve with the vinyl peeking out the side, and the record spins while it plays. I also cleaned it up so the music comes first: Album of the Day, the weekly chart, the listening room, the jukebox and the rest of the extras now sit behind one MORE TO EXPLORE button, right before the Internet Archive section. Bonus: save soundtracks to a PS2-style memory card.',
      tags: ['#Android', '#Kotlin', '#JetpackCompose', '#UIDesign', '#Music'],
      media: `${SITE}progress/retrohub/retrohub-albums-duo.gif`,
      mediaFit: 'full',
      project: 'RetroHub',
      likes: 0,
      likedBy: [],
      comments: [],
    },
  },
  // Scrapbook shows newest first, so these are created last-to-first.
  {
    key: 'retrohub-albums-scrap-5',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/retrohub/albums-memory-card.jpg`, tag: 'retrohub', caption: 'Albums, step 5: save a soundtrack to your Memory Card (PS2). 7.5 MB free, just like the real one.' },
  },
  {
    key: 'retrohub-albums-scrap-4',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/retrohub/albums-archive.jpg`, tag: 'retrohub', caption: 'Step 4: the extras fold into MORE TO EXPLORE, then the Internet Archive section with even more OSTs.' },
  },
  {
    key: 'retrohub-albums-scrap-3',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/retrohub/albums-covers.jpg`, tag: 'retrohub', caption: 'Step 3: every album is a sleeve with the record peeking out. Zelda, Undertale, FF7, LEGO Harry Potter…' },
  },
  {
    key: 'retrohub-albums-scrap-2',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/retrohub/albums-crate.jpg`, tag: 'retrohub', caption: 'Step 2: the Now Playing bar stays on top while you dig through the crate. Filter by era or vibe.' },
  },
  {
    key: 'retrohub-albums-scrap-1',
    collection: 'scrapbook',
    data: { kind: 'image', src: `${SITE}progress/retrohub/albums-player.jpg`, tag: 'retrohub', caption: 'Step 1: open an album and the sleeve slides out with its tracklist and reviews.' },
  },
  {
    key: 'retrohub-albums-scrap-video',
    collection: 'scrapbook',
    data: { kind: 'video', src: `${SITE}progress/retrohub/retrohub-albums.mp4`, tag: 'retrohub', caption: 'RetroHub Albums page redesign: same green scrapbook style as the rest of the app, music first.' },
  },
];

let running = false;

export async function publishAnnouncements() {
  if (running) return;
  running = true;
  let done = [];
  try { done = JSON.parse(localStorage.getItem(DONE_KEY)) || []; } catch { /* no storage */ }
  try {
    for (const a of ANNOUNCEMENTS) {
      if (done.includes(a.key)) continue;
      await devfeedStore.ensurePost(a.collection, a.key, a.data);
      done.push(a.key);
      try { localStorage.setItem(DONE_KEY, JSON.stringify(done)); } catch { /* no storage */ }
    }
  } catch (err) {
    console.error('Publishing progress posts failed', err);
  } finally {
    running = false;
  }
}
