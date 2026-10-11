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
