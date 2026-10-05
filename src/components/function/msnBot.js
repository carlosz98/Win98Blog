// CarlosBot: answers visitor questions about Carlos and this site, with a bit of
// personality. Runs entirely in the browser (no server, no API key): it matches
// keywords loosely (typos are fine), remembers a few things about the chat, and
// knows a couple of mini games.
import iconInfo from '../../icon.json';

const PROJECTS = iconInfo.filter(item => item.folderId === 'Project');
const EMAIL = 'czabala98@gmail.com';
const MEMORY_KEY = 'carlosbot_memory';

const pick = list => list[Math.floor(Math.random() * list.length)];

// ── Memory (kept for this browser tab) ──
function loadMemory() {
  try { return JSON.parse(sessionStorage.getItem(MEMORY_KEY)) || {}; } catch { return {}; }
}
let memory = loadMemory();
function remember(changes) {
  memory = { ...memory, ...changes };
  try { sessionStorage.setItem(MEMORY_KEY, JSON.stringify(memory)); } catch { /* ignore */ }
}
const nameOf = userName => memory.name || userName || '';
const hey = userName => (nameOf(userName) ? `, ${nameOf(userName)}` : '');

// ── Jokes and facts ──
const JOKES = [
  "Why did the Windows 98 PC go to therapy? Too many unresolved issues. And 37 toolbars.",
  "I'd tell you a UDP joke, but you might not get it.",
  "There are 10 kinds of people: those who understand binary and those who don't.",
  "Carlos once fixed a bug on the first try. Nobody believed him, so he wrote three more.",
  "My favorite song is the dial-up modem. It's a real banger: BEEEE-KSHHHH-dingdingding.",
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "I asked Clippy for help once. He's still asking if I'm writing a letter.",
  "A SQL query walks into a bar, walks up to two tables and asks: can I join you?",
  "Debugging is like being the detective in a crime movie where you're also the murderer.",
];
const FACTS = [
  "Windows 98 came out on June 25, 1998, and was the first Windows with built-in USB support that actually worked (mostly).",
  "The famous Windows 98 demo crashed live on stage with a blue screen. Bill Gates said: \"That must be why we're not shipping Windows 98 yet.\"",
  "MSN Messenger launched in 1999. The nudge feature came later and annoyed millions. You can try it with the nudge button!",
  "The 'Space Cadet' pinball game on the desktop shipped with Windows from 95 to XP.",
  "A 56k modem almost never actually hit 56,000 bits per second. More like 'please don't pick up the phone, Mom'.",
  "This whole desktop is React running in your browser. No floppy disks were harmed.",
];

// ── Topics: words that trigger them and a reply ──
const TOPICS = [
  {
    id: 'greeting',
    words: ['hi', 'hello', 'hey', 'yo', 'sup', 'hola', 'howdy', 'morning', 'evening', 'wassup'],
    reply: u => ({
      text: pick([
        `Hey${hey(u)}! I'm CarlosBot, Carlos's slightly overcaffeinated assistant. Ask me anything about him or this site.`,
        `Hello${hey(u)}! Welcome to 1998. Ask me about Carlos, his projects, or say "joke" if you need a laugh.`,
        `Yo${hey(u)}! What do you want to know? Carlos, his projects, his skills... or should I tell you a joke?`,
      ]),
    }),
  },
  {
    id: 'howareyou',
    words: ['how are you', 'how r u', 'hows it going', 'how is it going', 'whats up', 'how you doing', 'wyd'],
    reply: () => ({
      text: pick([
        "Running at 100% CPU and 0% bugs. Well, maybe 3% bugs. How about you?",
        "Pretty good! No blue screens today. Knock on wood (or on a beige case).",
        "I'm great, thanks for asking! Most people just ask for Carlos's email. 😅",
      ]),
    }),
  },
  {
    id: 'about',
    words: ['who', 'about', 'carlos', 'yourself', 'bio', 'background', 'introduce', 'tell me about'],
    reply: () => ({
      text: "Carlos Zabala is a programmer and software developer from New York City, studying at LaGuardia Community College. He builds games, mobile apps and retro experiences like this Windows 98 desktop.",
      actions: [{ label: 'Open About', open: 'About' }],
      more: "He got into programming through games, and he's into OOP, data structures and algorithms. He also loves anything retro, which explains... gestures at everything.",
    }),
  },
  {
    id: 'skills',
    words: ['skill', 'tech', 'stack', 'language', 'know', 'c++', 'java', 'c#', 'kotlin', 'swift', 'react', 'unity', 'unreal', 'experience', 'code', 'program'],
    reply: () => ({
      text: "He works mostly in C++, Java and C#. He makes games in Unity and Unreal Engine 5, mobile apps for Android (Kotlin) and iOS (SwiftUI), and web projects with React and Firebase. He's at a medium level with HTML, CSS and JavaScript, and currently learning PHP, MySQL and Node.js.",
      actions: [{ label: 'See skill meters', open: 'About' }],
      more: "His strongest is C++. He likes it because it lets you mess things up at a very low level. Respect.",
    }),
  },
  {
    id: 'projects',
    words: ['project', 'portfolio work', 'built', 'build', 'made', 'work', 'repo', 'github', 'app', 'games he made'],
    reply: () => ({
      text: `He has ${PROJECTS.length} projects here, including ${PROJECTS.slice(0, 5).map(p => p.name).join(', ')} and more. Ask me about any of them by name!`,
      actions: [{ label: 'Open Projects', open: 'Project' }, { label: 'GitHub', url: 'https://github.com/carlosz98' }],
      more: `The rest: ${PROJECTS.slice(5).map(p => p.name).join(', ') || 'that was all of them'}. Type a name and I'll tell you about it.`,
    }),
  },
  {
    id: 'contact',
    words: ['contact', 'email', 'mail', 'reach', 'linkedin', 'message him', 'talk to', 'phone'],
    reply: () => ({
      text: `You can email Carlos at ${EMAIL}, or send him a message right from the Mail window on the desktop. He's also on LinkedIn.`,
      actions: [{ label: 'Open Mail', open: 'Mail' }, { label: 'LinkedIn', url: 'https://www.linkedin.com/in/carloszabala98/' }],
    }),
  },
  {
    id: 'hire',
    words: ['hire', 'hiring', 'job', 'available', 'availability', 'remote', 'internship', 'opportunity', 'freelance', 'work with', 'recruiter'],
    reply: () => ({
      text: "Yes! Carlos is open to opportunities, on site in New York City or remote. Email is the fastest way to reach him. Tell him CarlosBot sent you, I work on commission. (I don't.)",
      actions: [{ label: 'Open Resume', open: 'Resume' }, { label: 'Open Mail', open: 'Mail' }],
    }),
  },
  {
    id: 'resume',
    words: ['resume', 'cv'],
    reply: () => ({ text: "His resume is on the desktop. Want me to open it?", actions: [{ label: 'Open Resume', open: 'Resume' }] }),
  },
  {
    id: 'education',
    words: ['school', 'college', 'study', 'education', 'degree', 'laguardia', 'university', 'student'],
    reply: () => ({ text: "Carlos studies at LaGuardia Community College in New York City." }),
  },
  {
    id: 'location',
    words: ['where', 'location', 'live', 'city', 'from', 'nyc', 'new york'],
    reply: () => ({ text: pick(["He's based in New York City. The city that never sleeps, much like a developer before a deadline.", "New York City! 🗽"]) }),
  },
  {
    id: 'hobby',
    words: ['hobby', 'free time', 'fun', 'music', 'like to do', 'his interests', 'retro', 'console'],
    reply: () => ({
      text: "In his free time he explores new tech, listens to music, collects retro hardware and tinkers with old machines. Big fan of anything with a CRT glow.",
      actions: [{ label: 'Open About', open: 'About' }],
    }),
  },
  {
    id: 'site',
    words: ['site', 'website', 'this page', 'how was', 'how did', 'made this', 'windows 98', 'win98', 'vite', 'source'],
    reply: () => ({
      text: "This site is a Windows 98 desktop running in your browser, built with React and Vite. The guestbook, gallery and visitor map use Firebase, and the music player is Webamp.",
      actions: [{ label: 'Source on GitHub', url: 'https://github.com/carlosz98/Win98Blog' }],
      more: "Secrets: try typing \"matrix\", \"bsod\" or \"screensaver\" in Start > Run. You didn't hear it from me.",
    }),
  },
  {
    id: 'secrets',
    words: ['secret', 'easter egg', 'hidden', 'cheat', 'trick'],
    reply: () => ({ text: "Psst... open Start > Run and type \"matrix\", \"bsod\" or \"screensaver\". Also, check the Recycle Bin. Carlos left some embarrassing files in there. 👀" }),
  },
  {
    id: 'blog',
    words: ['blog', 'devfeed', 'post', 'update', 'news', 'feed'],
    reply: () => ({
      text: "Carlos posts project updates in DevFeed, and he also has a blog made in Framer. Both are on the desktop.",
      actions: [{ label: 'Open DevFeed', open: 'DevFeed' }, { label: 'Open Blog', open: 'Blog' }],
    }),
  },
  {
    id: 'community',
    words: ['guestbook', 'sign', 'gallery', 'paint', 'draw', 'map', 'visitor'],
    reply: () => ({
      text: "You can sign the Guestbook, draw something for the Paint Gallery, and see where visitors come from on the Visitor Map. All on the desktop!",
      actions: [{ label: 'Guestbook', open: 'Guestbook' }, { label: 'Paint Gallery', open: 'Paint Gallery' }],
    }),
  },
  {
    id: 'play',
    words: ['play', 'game', 'solitaire', 'minesweeper', 'doom', 'pinball', 'invaders', 'bored', 'winamp'],
    reply: () => ({
      text: "There's Solitaire, Minesweeper, Doom, Space Invaders and 3D Pinball on the desktop. Or play with me: say \"guess the number\", \"rock paper scissors\", or ask the magic 8-ball a question!",
      actions: [{ label: 'Doom', open: 'Doom' }, { label: 'Pinball', open: 'Pinball' }],
    }),
  },
  {
    id: 'joke',
    words: ['joke', 'funny', 'laugh', 'make me laugh', 'humor'],
    reply: () => ({ text: pick(JOKES) }),
  },
  {
    id: 'fact',
    words: ['fact', 'trivia', 'did you know', 'something interesting'],
    reply: () => ({ text: `💡 ${pick(FACTS)}` }),
  },
  {
    id: 'bot',
    words: ['are you real', 'are you human', 'are you ai', 'robot', 'bot', 'chatgpt', 'who made you', 'what are you'],
    reply: () => ({ text: pick([
      "I'm CarlosBot, a 100% handmade, locally sourced, artisanal chatbot. No cloud, no API, just vibes and JavaScript.",
      "I'm a bot, but a bot with feelings. Mostly the feeling of wanting you to check out Carlos's projects.",
    ]) }),
  },
  {
    id: 'love',
    words: ['love you', 'marry', 'date me', 'cute', 'crush'],
    reply: () => ({ text: pick(["Aww, I'm flattered! But I'm already in a relationship with this Pentium II.", "❤️ Sorry, my heart belongs to Clippy."]) }),
  },
  {
    id: 'rude',
    words: ['stupid', 'dumb', 'useless', 'idiot', 'sucks', 'hate you', 'shut up'],
    reply: () => ({ text: pick(["Ouch. I'll go cry in the Recycle Bin. 😢", "Hey, I'm doing my best with 64 MB of RAM!", "Rude! I'm telling Clippy."]) }),
  },
  {
    id: 'thanks',
    words: ['thanks', 'thank you', 'thx', 'ty', 'cool', 'nice', 'awesome', 'great', 'amazing'],
    reply: u => ({ text: pick([`Anytime${hey(u)}! Anything else?`, "Glad I could help! 😎", "You're welcome! I accept tips in the form of guestbook signatures."]) }),
  },
  {
    id: 'bye',
    words: ['bye', 'goodbye', 'see you', 'cya', 'gtg', 'good night'],
    reply: u => ({ text: pick([`Bye${hey(u)}! Thanks for stopping by. 👋`, "See ya! Don't forget to sign the guestbook on your way out.", "Logging off... *dial-up disconnect noises*"]) }),
  },
  {
    id: 'help',
    words: ['help', 'what can you', 'options', 'menu', 'commands'],
    reply: () => ({
      text: "Ask me about Carlos, his skills, projects, contact info or this site. I can also tell jokes, share retro facts, play guess the number or rock paper scissors, answer with the magic 8-ball, and do quick math (try \"what is 12 * 7\").",
    }),
  },
];

export const SUGGESTIONS = ['Who is Carlos?', 'Projects', 'Skills', 'Tell me a joke', 'Play a game'];

export const GREETING = {
  text: "Hi, I'm CarlosBot! 👋 Ask me anything about Carlos, his projects, or this site. I also know jokes and games.",
};

// ── Text helpers ──
function normalize(text) {
  return ` ${text.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9+#?\s]/g, ' ').replace(/\s+/g, ' ').trim()} `;
}
// Very small stemmer so "projects", "skills" and "building" match their base words.
function stem(word) {
  return word.replace(/(.)\1+$/, '$1').replace(/(ing|ed|es|s)$/, '') || word;
}
function editDistance(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}
// Does one keyword appear in the message? Single words allow small typos.
function matches(clean, words, keyword) {
  if (keyword.includes(' ')) return clean.includes(` ${keyword} `);
  if (clean.includes(` ${keyword} `)) return true;
  const k = stem(keyword);
  return words.some(w => {
    const s = stem(w);
    if (s === k) return true;
    // "hiring" -> "hir" still matches "hire".
    if (Math.min(s.length, k.length) >= 3 && (s.startsWith(k) || k.startsWith(s)) && Math.abs(s.length - k.length) <= 2) return true;
    if (k.length < 4 || s.length < 4) return false;
    return editDistance(s, k) <= (k.length >= 7 ? 2 : 1);
  });
}

function findProject(clean) {
  const squash = clean.replace(/\s/g, '');
  return PROJECTS.find(p => {
    const name = p.name.toLowerCase();
    if (squash.includes(name.replace(/\s/g, ''))) return true;
    if (name.split(' ')[0].length > 3 && clean.includes(` ${name.split(' ')[0]} `)) return true;
    // A word of 5+ letters that starts the project name, like "flappy" for FlappyBird.
    return clean.trim().split(' ').some(w => w.length >= 5 && name.replace(/\s/g, '').startsWith(w));
  });
}

// ── Mini games ──
const RPS = ['rock', 'paper', 'scissors'];
const BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
const EIGHT_BALL = [
  'It is certain.', 'Without a doubt.', 'Ask again after a reboot.', 'My sources (Clippy) say no.',
  'Outlook good.', 'Very doubtful.', 'Signs point to yes.', 'Cannot predict now, the modem disconnected.',
];

function playGames(clean, raw) {
  // Guess the number, in progress.
  if (memory.secret) {
    const guess = raw.match(/-?\d+/);
    if (/ (stop|quit|give up|exit) /.test(clean)) {
      const n = memory.secret;
      remember({ secret: null, tries: 0 });
      return { text: `Quitter! 😄 It was ${n}.` };
    }
    if (guess) {
      const n = Number(guess[0]);
      const tries = (memory.tries || 0) + 1;
      if (n === memory.secret) {
        remember({ secret: null, tries: 0 });
        return { text: `🎉 Yes! It was ${n}. You got it in ${tries} ${tries === 1 ? 'try' : 'tries'}. ${tries <= 4 ? 'Impressive!' : 'Not bad!'}` };
      }
      remember({ tries });
      return { text: n < memory.secret ? `Higher! ⬆️ (try ${tries})` : `Lower! ⬇️ (try ${tries})` };
    }
  }
  if (/ guess (the |a )?number | number game /.test(clean)) {
    remember({ secret: 1 + Math.floor(Math.random() * 100), tries: 0 });
    return { text: "I'm thinking of a number between 1 and 100. Take a guess! (Say \"stop\" to give up.)" };
  }

  // Rock paper scissors.
  const move = RPS.find(m => clean.includes(` ${m} `));
  if (/ rock paper scissors | rps /.test(clean) && !(move && clean.trim().split(' ').length === 1)) {
    remember({ rps: true });
    return { text: 'Rock, paper, scissors... shoot! Type rock, paper or scissors.' };
  }
  if (move && (memory.rps || clean.trim() === move)) {
    remember({ rps: false });
    const mine = pick(RPS);
    const result = mine === move ? "It's a tie! 🤝" : BEATS[move] === mine ? 'You win! 🏆' : 'I win! 😎';
    return { text: `You: ${move}. Me: ${mine}. ${result}` };
  }

  // Magic 8-ball: yes/no questions that start with "will", "should", "am", "is" etc., or "8 ball".
  if (/ (8 ?ball|magic ball) /.test(clean) || (/^ (will|should|can|am|is|do|does) /.test(clean) && raw.trim().endsWith('?') && !/ carlos | he | his | him /.test(clean))) {
    return { text: `🎱 ${pick(EIGHT_BALL)}` };
  }
  return null;
}

// ── Small talk helpers ──
function quickMath(raw) {
  const m = raw.replace(/x/gi, '*').match(/(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)/);
  if (!m) return null;
  const [a, op, b] = [Number(m[1]), m[2], Number(m[3])];
  const value = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : b === 0 ? null : a / b;
  if (value === null) return { text: "Dividing by zero? That's how you get a blue screen. 💙" };
  return { text: `${m[1]} ${op} ${m[3]} = ${Math.round(value * 1000) / 1000}. Faster than a Pentium! 🧮` };
}

function learnName(raw) {
  // "I'm ..." only counts in short messages, so "I'm interested in..." isn't a name.
  const short = raw.split(/\s+/).length <= 4;
  const m = raw.match(/\b(?:my name is|call me)\s+([A-Za-z][A-Za-z'-]{1,20})\b/i)
    || (short && raw.match(/^(?:hi,?\s+|hey,?\s+)?(?:i am|i'm|im)\s+([A-Za-z][A-Za-z'-]{1,20})\b/i));
  if (!m) return null;
  const name = m[1][0].toUpperCase() + m[1].slice(1);
  if (['Fine', 'Good', 'Ok', 'Okay', 'Bored', 'Here', 'Not', 'Just', 'Great', 'Tired', 'Looking'].includes(name)) return null;
  remember({ name });
  return { text: pick([`Nice to meet you, ${name}! 🤝 What do you want to know about Carlos?`, `${name}! Great name. I'll remember it (at least until you close this tab).`]) };
}

export function botReply(input, { userName } = {}) {
  const raw = input.trim();
  const clean = normalize(raw);
  const words = clean.replace(/\?/g, ' ').trim().split(/\s+/).map(w => w.replace(/(.)\1{2,}/g, '$1').replace(/(.)\1+$/, '$1'));

  const game = playGames(clean, raw);
  if (game) return game;

  const named = learnName(raw);
  if (named) return named;

  if (/ (whats|what is) my name /.test(clean)) {
    return { text: nameOf(userName) ? `You're ${nameOf(userName)}! I never forget a face. Well, I don't have eyes, but still.` : "You haven't told me yet! Say \"my name is ...\"." };
  }

  // Follow-ups like "tell me more" use the last topic.
  if (/ (more|tell me more|go on|and|why|really|explain) /.test(clean) && words.length <= 4 && memory.lastMore) {
    const more = memory.lastMore;
    remember({ lastMore: null });
    return { text: more };
  }

  if (/ (time|date|day is it|today) /.test(clean) && / (what|whats) /.test(clean)) {
    const now = new Date();
    return { text: `It's ${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} on ${now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}. In 1998 terms: time to defrag.` };
  }

  const math = /\d\s*[+\-*/x]\s*\d/i.test(raw) ? quickMath(raw) : null;
  if (math) return math;

  // A specific project by name beats the general topics.
  const project = findProject(clean);
  if (project) {
    remember({ lastMore: null, lastTopic: 'project' });
    return {
      text: `${project.name}: ${project.description}`,
      actions: [{ label: 'View on GitHub', url: project.url }],
    };
  }

  let best = null;
  let bestScore = 0;
  for (const topic of TOPICS) {
    const score = topic.words.reduce((n, w) => n + (matches(clean, words, w) ? w.length : 0), 0);
    if (score > bestScore) { best = topic; bestScore = score; }
  }
  if (best) {
    const { more, ...reply } = best.reply(userName);
    remember({ lastMore: more || null, lastTopic: best.id, misses: 0 });
    return reply;
  }

  const misses = (memory.misses || 0) + 1;
  remember({ misses });
  if (misses >= 3) {
    remember({ misses: 0 });
    return { text: "I'm not getting it, sorry! I'm just a humble 1998 bot. Try one of these: \"Who is Carlos?\", \"projects\", \"skills\", \"contact\", \"joke\" or \"play a game\"." };
  }
  return {
    text: pick([
      "Hmm, that one went over my head. 🤔 Try asking about Carlos, his projects, skills, or how to contact him.",
      "Error 404: answer not found. Ask me about Carlos, his work, or say \"joke\"!",
      "I didn't quite get that. My brain runs on 64 MB of RAM. Try \"help\" to see what I can do.",
    ]),
  };
}
