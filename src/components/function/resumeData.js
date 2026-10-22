// Content of the Resume window. Only facts Carlos has already published on
// the site, his portfolio or GitHub. Add work experience, dates and a
// downloadable PDF here once he sends them.

export const RESUME = {
  name: 'Carlos Zabala',
  title: 'Programmer & Software Developer',
  location: 'New York City · On site / Remote',
  contact: [
    { label: 'czabala98@gmail.com', open: 'Mail' },
    { label: 'linkedin.com/in/carloszabala98', url: 'https://www.linkedin.com/in/carloszabala98/' },
    { label: 'github.com/carlosz98', url: 'https://github.com/carlosz98' },
    { label: 'Portfolio', url: 'https://carlosz98.github.io/MyPortFolio/' },
  ],
  summary:
    'Student developer at LaGuardia Community College who builds games, mobile apps and ' +
    'retro web experiences. Focused on OOP, data structures and algorithms, with 20 projects ' +
    'across C++, Java, C#, Kotlin, Swift and JavaScript. Open to opportunities.',
  education: {
    school: 'LaGuardia Community College',
    place: 'Long Island City, NY',
    coursework: [
      'MAC 110 Systems Analysis & Design',
      'MAC 125 Advanced C/C++',
      'MAC 172 HTML & CSS',
      'MAC 221 iOS Development (SwiftUI)',
      'MAC 232 Linux',
      'MAC 272 Web Development 2',
      'MAC 280 Videogame Programming',
    ],
  },
  skills: [
    { group: 'Languages', items: 'C++, Java, C#, Kotlin, Swift, JavaScript, Python, HTML/CSS, SQL' },
    { group: 'Game dev', items: 'Unity, Unreal Engine 5 (Blueprints), game design docs, pixel art' },
    { group: 'Mobile', items: 'Android (Jetpack Compose, MVVM), iOS (SwiftUI)' },
    { group: 'Web', items: 'React, Vite, Framer Motion, Framer, GitHub Pages' },
    { group: 'Cloud & data', items: 'Firebase (Firestore, Auth), Google Cloud SQL, MySQL, Metabase' },
    { group: 'Learning', items: 'PHP, Node.js' },
  ],
  // `project` matches a Project folder icon, so clicking it opens the project.
  projects: [
    { project: 'Win98Blog', name: 'Win98Blog', stack: 'React · Vite · Firebase',
      text: 'This Windows 98 desktop: draggable windows, DevFeed and Guestbook on Firestore with Google sign-in, games and screensavers.' },
    { project: 'RetroHub', name: 'RetroHub', stack: 'Android · Kotlin · Jetpack Compose',
      text: 'Social app for retro gamers on Firebase (MVVM): community feed, real-time chat, IGDB game database, streams and XP profiles.' },
    { project: 'PetHomeVet', name: 'PetHome Vet', stack: 'HTML · CSS · JavaScript',
      text: 'Vet clinic site with service filters, a 4-step booking flow and a My Pets portal.' },
    { project: 'WarmRain UE5', name: 'Warm Rain of Summer', stack: 'Unreal Engine 5',
      text: 'Open-world travel game with a 51-page game design document, built alongside Epic\'s UE5 course.' },
    { project: 'Gunbound2D', name: 'Gunbound 2D', stack: 'Unity · C#',
      text: 'Two-player turn-based artillery game with Rigidbody2D physics, built in 3 days as a final project.' },
    { project: 'EmployeeMgmt', name: 'Employee Management System', stack: 'C++',
      text: 'OOP, polymorphism, multithreading and file I/O.' },
    { project: 'RetroiOS', name: 'RetroiOS', stack: 'Swift · SwiftUI',
      text: 'Windows 98 desktop for iPhone with reusable retro UI pieces and a CRT effect.' },
    { project: 'NetflixDB', name: 'Netflix Database', stack: 'MySQL · Google Cloud SQL',
      text: 'Kaggle datasets loaded into Cloud SQL and explored with Metabase dashboards.' },
    { project: 'LibraryMgmt', name: 'Library Management System', stack: 'Java',
      text: 'OOP with inheritance and ArrayList-based data structures.' },
  ],
};
