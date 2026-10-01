// CarlosBot: answers visitor questions about Carlos and this site.
// Runs entirely in the browser by matching keywords, so it needs no server.
import iconInfo from '../../icon.json';

const PROJECTS = iconInfo.filter(item => item.folderId === 'Project');

const EMAIL = 'czabala98@gmail.com';

// Each topic: words that trigger it, and a reply (text + optional buttons
// that open a window on the desktop or a link).
const TOPICS = [
  {
    id: 'greeting',
    words: ['hi', 'hello', 'hey', 'yo', 'sup', 'hola', 'good morning', 'good evening'],
    reply: () => ({
      text: "Hey! I'm CarlosBot. Ask me about Carlos, his projects, his skills, or how this site works.",
    }),
  },
  {
    id: 'about',
    words: ['who', 'about', 'carlos', 'yourself', 'bio', 'background', 'introduce'],
    reply: () => ({
      text: "Carlos Zabala is a programmer and software developer from New York City, studying at LaGuardia Community College. He builds software, games and retro experiences like this Windows 98 desktop.",
      actions: [{ label: 'Open About', open: 'About' }],
    }),
  },
  {
    id: 'skills',
    words: ['skill', 'skills', 'tech', 'stack', 'language', 'languages', 'know', 'c++', 'java', 'kotlin', 'swift', 'react', 'unity', 'unreal', 'experience'],
    reply: () => ({
      text: "He works mostly in C++, Java and C#, with a focus on OOP, data structures and algorithms. He makes games in Unity and Unreal Engine 5, mobile apps for Android (Kotlin / Jetpack Compose) and iOS (SwiftUI), and web projects with React, plus Firebase and GCP.",
      actions: [{ label: 'See skill meters', open: 'About' }],
    }),
  },
  {
    id: 'projects',
    words: ['project', 'projects', 'portfolio work', 'built', 'build', 'made', 'work', 'repos', 'github', 'apps', 'games'],
    reply: () => ({
      text: `He has ${PROJECTS.length} projects here, including ${PROJECTS.slice(0, 5).map(p => p.name).join(', ')} and more. Ask me about any of them by name, or open the Project folder.`,
      actions: [{ label: 'Open Projects', open: 'Project' }, { label: 'GitHub', url: 'https://github.com/carlosz98' }],
    }),
  },
  {
    id: 'contact',
    words: ['contact', 'email', 'mail', 'reach', 'linkedin', 'message him', 'talk to', 'phone'],
    reply: () => ({
      text: `You can email Carlos at ${EMAIL} or find him on LinkedIn at linkedin.com/in/carloszabala98.`,
      actions: [{ label: 'Open Mail', open: 'Mail' }, { label: 'LinkedIn', url: 'https://www.linkedin.com/in/carloszabala98/' }],
    }),
  },
  {
    id: 'hire',
    words: ['hire', 'hiring', 'job', 'jobs', 'available', 'availability', 'remote', 'internship', 'opportunity', 'opportunities', 'freelance', 'work with'],
    reply: () => ({
      text: "Yes, Carlos is open to opportunities, on site in New York City or remote. The quickest way to reach him is email.",
      actions: [{ label: 'Open Resume', open: 'Resume' }, { label: 'Open Mail', open: 'Mail' }],
    }),
  },
  {
    id: 'resume',
    words: ['resume', 'cv', 'résumé'],
    reply: () => ({
      text: "His resume is on the desktop. Want me to open it?",
      actions: [{ label: 'Open Resume', open: 'Resume' }],
    }),
  },
  {
    id: 'education',
    words: ['school', 'college', 'study', 'studies', 'education', 'degree', 'laguardia', 'university'],
    reply: () => ({ text: "Carlos studies at LaGuardia Community College in New York City." }),
  },
  {
    id: 'location',
    words: ['where', 'location', 'live', 'city', 'from', 'nyc', 'new york'],
    reply: () => ({ text: "He's based in New York City." }),
  },
  {
    id: 'hobby',
    words: ['hobby', 'hobbies', 'free time', 'fun', 'music', 'like to do', 'interests'],
    reply: () => ({
      text: "In his free time he explores new tech, listens to music, collects retro hardware and tinkers with old machines. Big fan of anything with a CRT glow.",
    }),
  },
  {
    id: 'site',
    words: ['site', 'website', 'this page', 'how was', 'how did', 'made this', 'windows 98', 'win98', 'react', 'vite'],
    reply: () => ({
      text: "This site is a Windows 98 desktop that runs in your browser. It's built with React and Vite, uses Framer Motion for animations and Webamp for the music player, and the DevFeed posts are stored in Firebase.",
      actions: [{ label: 'Source on GitHub', url: 'https://github.com/carlosz98/Win98Blog' }],
    }),
  },
  {
    id: 'blog',
    words: ['blog', 'devfeed', 'posts', 'updates', 'news', 'feed'],
    reply: () => ({
      text: "Carlos posts project updates in DevFeed, and he also has a blog made in Framer. Both are on the desktop.",
      actions: [{ label: 'Open DevFeed', open: 'DevFeed' }, { label: 'Open Blog', open: 'Blog' }],
    }),
  },
  {
    id: 'portfolio',
    words: ['portfolio', 'myportfolio'],
    reply: () => ({
      text: "His other portfolio site is at carlosz98.github.io/MyPortFolio.",
      actions: [{ label: 'Open Portfolio', open: 'Portfolio' }],
    }),
  },
  {
    id: 'play',
    words: ['play', 'game on', 'solitaire', 'minesweeper', 'music', 'winamp', 'bored'],
    reply: () => ({
      text: "There's Solitaire and Minesweeper to play, and Winamp for music. Look around the desktop and the Start menu!",
      actions: [{ label: 'Play Solitaire', open: 'Solitaire' }],
    }),
  },
  {
    id: 'thanks',
    words: ['thanks', 'thank you', 'thx', 'ty', 'cool', 'nice', 'awesome', 'great'],
    reply: () => ({ text: "Anytime! Anything else you want to know?" }),
  },
  {
    id: 'bye',
    words: ['bye', 'goodbye', 'see you', 'later', 'cya'],
    reply: () => ({ text: "Bye! Thanks for stopping by. 👋" }),
  },
  {
    id: 'help',
    words: ['help', 'what can you', 'options', 'menu', '?'],
    reply: () => ({
      text: "You can ask me things like: Who is Carlos? What are his skills? Show me his projects. How do I contact him? Is he available for work? How was this site made?",
    }),
  },
];

export const SUGGESTIONS = ['Who is Carlos?', 'Projects', 'Skills', 'Contact', 'How was this site made?'];

export const GREETING = {
  text: "Hi, I'm CarlosBot! 👋 Ask me anything about Carlos, his projects, or this site.",
};

function normalize(text) {
  return ` ${text.toLowerCase().replace(/[^a-z0-9+#?\s]/g, ' ').replace(/\s+/g, ' ')} `;
}

function findProject(clean) {
  const squash = clean.replace(/\s/g, '');
  return PROJECTS.find(p => {
    const name = p.name.toLowerCase();
    return squash.includes(name.replace(/\s/g, '')) || clean.includes(` ${name.split(' ')[0]} `);
  });
}

export function botReply(input) {
  const clean = normalize(input);

  // A specific project by name beats the general topics.
  const project = findProject(clean);
  if (project) {
    return {
      text: `${project.name}: ${project.description}`,
      actions: [{ label: 'View on GitHub', url: project.url }],
    };
  }

  let best = null;
  let bestScore = 0;
  for (const topic of TOPICS) {
    const score = topic.words.reduce((n, w) => n + (clean.includes(` ${w} `) || (w.includes(' ') && clean.includes(w)) ? w.length : 0), 0);
    if (score > bestScore) { best = topic; bestScore = score; }
  }
  if (best) return best.reply();

  return {
    text: "Hmm, I'm not sure about that one. Try asking about Carlos, his projects, skills, contact info, or how this site was made.",
  };
}
