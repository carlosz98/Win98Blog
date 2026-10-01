# Win98 Blog — Carlos Zabala

**A Windows 98-inspired portfolio & blog built with React + Vite.**

> If you fork this repo, please give credit! It helps me land a job 🙏

🌐 **Live Demo:** *(coming soon)*

---

## What is this?

A fully functional Windows 98 desktop simulation running in the browser — built as my personal portfolio and blog. Every window, icon, drag, and animation was built from scratch with no UI libraries.

---

## Stack

React · Vite · Framer Motion · React Draggable · Webamp · WebSocket · GNews API · Open-Meteo API

---

## Highlights

- 🖥️ **Full Win98 Desktop** — draggable windows, start menu, right-click, recycle bin, taskbar, icon drag & drop
- 📰 **DevFeed** — Facebook-style project update feed with admin-only posting, persistent likes & comments, rich text formatting
- 🎵 **Winamp** — real music player with a custom GIF visualizer that syncs to each song
- 💬 **MSN Chat** — live WebSocket chat with notifications, spam filter, and session keys
- 🌐 **IE Browser** — in-app browser that loads my blog, GitHub projects, TheOldNet, and more
- 📁 **Projects** — all 13 projects linked to GitHub, openable inside the desktop
- 🎮 **Games** — Solitaire, MineSweeper
- 📬 **Mail** — contact window with email, LinkedIn, GitHub
- 📊 **Extras** — Bitcoin tracker, retro gaming news, weather, calendar, Paint, Task Manager, Store
- 💾 **BIOS startup animation** — plays on first visit, then skips on refresh

---

## My Projects

| Project | Stack |
|---|---|
| RetroHub Android App | Kotlin, Jetpack Compose, Firebase |
| Win98 Blog | HTML/CSS/JS, React, Framer |
| iOS Retro App | SwiftUI |
| Flappy Bird / Gunbound 2D | Unity, C# |
| Library Management System | Java, OOP |
| Netflix DB & GCP | MySQL, GCP, Metabase |
| GPA Calculator | C++ |
| DMV Project | Java, Data Structures |
| Employee Management System | C++, Threading |
| Warm Rain UE5 *(in progress)* | Unreal Engine 5, C++, Blueprints |
| 2D Pixel City *(in progress)* | Unity 2D |

---

## DevFeed setup (shared posts)

DevFeed posts are stored in Firebase Firestore so every visitor sees the same feed. Without Firebase config they fall back to this browser's localStorage, which only you will see.

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com) and add a **Web app**.
2. Turn on **Firestore Database** and **Authentication > Sign-in method > Google**.
3. In `firestore.rules`, replace `your-email@gmail.com` with the Google account you'll post from, then paste the file into **Firestore > Rules** and publish.
4. Copy `.env.example` to `.env.local` and fill in the web app config plus `VITE_DEVFEED_ADMIN_EMAIL`.
5. For the GitHub Pages deploy, add the same `VITE_*` names as repository secrets (Settings > Secrets and variables > Actions); `deploy.yml` already passes them to the build.
6. Add your site's domain under **Authentication > Settings > Authorized domains**.

Click **Post** in DevFeed and sign in with that Google account to write. The first sign-in copies the starter posts into Firestore if it is empty.

---

## Credits

- Windows 95 icons: [oldwindowsicons.tumblr.com](https://oldwindowsicons.tumblr.com/tagged/windows%2095)
- Paint: [jspaint](https://github.com/1j01/jspaint)
- Winamp player: [Webamp](https://github.com/captbaritone/webamp)

---

## Connect

[LinkedIn](https://www.linkedin.com/in/carloszabala98/) · [GitHub](https://github.com/carlosz98) · [Blog](https://charlysblog.framer.website/)

© 2025 Carlos Zabala — New York City
