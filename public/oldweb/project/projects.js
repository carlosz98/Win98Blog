// Data for the 90s project pages (index.html?p=<key>). Built from the DevFeed past-project posts.
window.THEMES = {
 "stars": {
  "bg": "stars-bg.gif",
  "bgColor": "#000010",
  "text": "#ffffff",
  "panel": "rgba(0,0,40,0.88)",
  "title": "#00ffff",
  "glow": "#0066ff",
  "font": "'Comic Sans MS', cursive"
 },
 "grid": {
  "bg": "bg-grid.gif",
  "bgColor": "#001000",
  "text": "#00ff00",
  "panel": "rgba(0,0,0,0.9)",
  "title": "#00ff00",
  "glow": "#006600",
  "font": "'Courier New', monospace"
 },
 "checker": {
  "bg": "bg-checker.gif",
  "bgColor": "#280040",
  "text": "#ffffff",
  "panel": "rgba(20,0,40,0.9)",
  "title": "#ff66ff",
  "glow": "#9900ff",
  "font": "'Comic Sans MS', cursive"
 },
 "sky": {
  "bg": "bg-sky.gif",
  "bgColor": "#4682dc",
  "text": "#000000",
  "panel": "rgba(255,255,240,0.93)",
  "title": "#ffff00",
  "glow": "#ff6600",
  "font": "'Comic Sans MS', cursive"
 },
 "bricks": {
  "bg": "bg-bricks.gif",
  "bgColor": "#3c0000",
  "text": "#ffffff",
  "panel": "rgba(0,0,0,0.88)",
  "title": "#ff3300",
  "glow": "#ffcc00",
  "font": "Impact, 'Arial Black', sans-serif"
 },
 "dots": {
  "bg": "bg-dots.gif",
  "bgColor": "#006060",
  "text": "#000000",
  "panel": "#c0c0c0",
  "title": "#ffffff",
  "glow": "#000080",
  "font": "'Arial Black', Arial, sans-serif"
 }
};
window.PROJECTS = {
 "netflix": {
  "name": "NetflixDB",
  "title": "Netflix Database on Google Cloud",
  "sub": "~ a cloud database starring 1,000s of movies ~",
  "marquee": "Now showing: MySQL on Google Cloud *** Kaggle data *** Metabase dashboards *** Grab some popcorn ***",
  "body": "Built a Netflix-style relational database in MySQL and hosted it on a Google Cloud SQL instance. I pulled Kaggle CSV datasets into Cloud Storage buckets, loaded them through the GCloud Shell, then explored the catalog with Metabase dashboards and charts. My first real taste of cloud databases.",
  "tags": [
   "MySQL",
   "GoogleCloud",
   "CloudSQL",
   "Metabase",
   "Kaggle"
  ],
  "media": "fun-netflix.gif",
  "placeholder": true,
  "video": "4tRYxzllkQA",
  "source": "https://github.com/carlosz98",
  "theme": "bricks",
  "toy": null
 },
 "pet-adoption": {
  "name": "PetAdoption",
  "title": "PetHome: a pet adoption center site",
  "sub": "~ find your new best friend ~",
  "marquee": "Adopt *** Foster *** Volunteer *** Every pet deserves a home *** Planned the SDLC way ***",
  "body": "Class project for MAC 110 (Project Management). Before writing any code I planned the whole thing the SDLC way: Work Breakdown Structure, SWOT analysis, Context and Data Flow Diagrams, a Decision Table and a Gantt chart. Then I built PetHome: pages for Home, About, Adopt, Foster and Volunteer with featured pets, a newsletter signup and adoption, foster and volunteer forms backed by PHP handlers that validate and sanitize the input.",
  "tags": [
   "HTML",
   "CSS",
   "JavaScript",
   "PHP",
   "SDLC",
   "ProjectManagement"
  ],
  "media": "pet-adoption.gif",
  "placeholder": false,
  "video": "PmNVaZcAHDA",
  "source": "https://github.com/carlosz98/Pet-Adoption-Center",
  "theme": "sky",
  "toy": null
 },
 "retro-ios": {
  "name": "RetroiOS",
  "title": "RetroiOS: Windows 98 on an iPhone",
  "sub": "~ Windows 98 in your pocket ~",
  "marquee": "Start button *** Blue title bars *** 3D borders *** All built in SwiftUI ***",
  "body": "Final project for iOS Development: a SwiftUI app that turns the phone into a Windows 98 desktop. I built the Win98 look from scratch as reusable SwiftUI pieces: the gray palette, raised and sunken 3D borders, a custom button style, blue title bars, desktop icons and a taskbar with a Start button and clock. On top of that there's a CRT effect (scanlines, a slow light sweep and film grain) and a retro music player window.",
  "tags": [
   "Swift",
   "SwiftUI",
   "iOS",
   "ViewModifiers",
   "RetroUI"
  ],
  "media": "fun-ios.gif",
  "placeholder": true,
  "video": null,
  "source": "https://github.com/carlosz98/IOS-Final-Project-Win98-UI",
  "theme": "dots",
  "toy": null
 },
 "gpa-calc": {
  "name": "GPACalc",
  "title": "College GPA Calculator (C++)",
  "sub": "~ how cooked is your GPA? ~",
  "marquee": "Enter your classes *** Get your weighted GPA *** Try the calculator below ***",
  "body": "A C++ console tool that asks how many classes you took, then each class's name, credits and grade, and returns your weighted GPA rounded to two decimals. Every number is validated: no negative credits, no grades outside 0.0 to 4.0, and bad input gets asked again instead of crashing.",
  "tags": [
   "CPlusPlus",
   "Structs",
   "Vectors",
   "InputValidation"
  ],
  "media": "gpa-calculator.gif",
  "placeholder": false,
  "video": "jCxr4QT_Mm4",
  "source": "https://github.com/carlosz98/College-Gpa-Calculator---C-",
  "theme": "grid",
  "toy": "gpa"
 },
 "library": {
  "name": "LibraryMgmt",
  "title": "Library Management System (Java)",
  "sub": "~ books, vinyl and movies, all checked out ~",
  "marquee": "Borrow *** Return *** Donate *** One LibraryItem class to rule them all ***",
  "body": "A command-line library for books, vinyl records and movies. You can show the catalog, borrow, return and donate items. Book, Vinyl and Movie all extend one LibraryItem class, so the borrow and return logic is written once and works for every kind of item, and donations add new titles on the fly.",
  "tags": [
   "Java",
   "OOP",
   "Inheritance",
   "ArrayList",
   "DataStructures"
  ],
  "media": "library-management.gif",
  "placeholder": false,
  "video": "6lAlVk0Kl3I",
  "source": "https://github.com/carlosz98/Library-Management-System---Java",
  "theme": "checker",
  "toy": null
 },
 "dmv": {
  "name": "DMVProject",
  "title": "DMV vehicle registration (Java)",
  "sub": "~ no waiting in line, I promise ~",
  "marquee": "Owner info *** Make, model, VIN, plate, year *** Take a number ***",
  "body": "A Java app that simulates registering cars at the DMV. It takes the owner's name and address, then as many vehicles as you want (make, model, VIN, plate and year), and prints the full owner record at the end. Owner keeps an ArrayList of Vehicle objects, and each class formats its own details with toString().",
  "tags": [
   "Java",
   "OOP",
   "ArrayList",
   "Scanner",
   "DataStructures"
  ],
  "media": "dmv-project.gif",
  "placeholder": false,
  "video": "817uSUc2tYg",
  "source": "https://github.com/carlosz98/DMV-Project",
  "theme": "dots",
  "toy": null
 },
 "employee": {
  "name": "EmployeeMgmt",
  "title": "Employee Management System (C++)",
  "sub": "~ hire, update, fire (just kidding) ~",
  "marquee": "Add *** Update *** Delete *** Saved to employees.txt *** Advanced C++ final ***",
  "body": "My Advanced C++ final: a menu-driven system to add, update, delete and list employee records, saved to and loaded from employees.txt so the data survives a restart. Manager inherits from Employee with a polymorphic displayDetails(), custom InvalidInputException and FileIOException classes catch bad input and file errors, and std::thread demos run adds and updates at the same time.",
  "tags": [
   "CPlusPlus",
   "OOP",
   "Polymorphism",
   "Multithreading",
   "FileIO"
  ],
  "media": "employee-management.gif",
  "placeholder": false,
  "video": "kEqftDn_TNY",
  "source": "https://github.com/carlosz98/Employee-Management-System---C--",
  "theme": "grid",
  "toy": null
 },
 "gunbound": {
  "name": "Gunbound2D",
  "title": "Gunbound 2D replica in Unity",
  "sub": "~ aim, charge, FIRE!!! ~",
  "marquee": "Two players *** 20 second turns *** Hold SPACE to charge *** Built in 3 days ***",
  "body": "A two-player artillery game inspired by Gunbound, built in Unity in 3 days for my Game Programming final. Players take turns on a 20-second timer: move with A and D, hold Space to charge the power bar, and release to fire. Shots fly with Rigidbody2D physics and gravity, spin through the air and knock health off the other player's bar. Eleven C# scripts split up the players, shots, power bar, health and the turn logic.",
  "tags": [
   "Unity",
   "CSharp",
   "GameDev",
   "Physics2D",
   "TurnBased"
  ],
  "media": "fun-gunbound.gif",
  "placeholder": true,
  "video": "75j3qdD0zp4",
  "source": "https://github.com/carlosz98/Gunboun---Replica-in-Unity",
  "theme": "bricks",
  "toy": null
 },
 "flappy": {
  "name": "FlappyBird",
  "title": "Flappy Bird replica in Unity",
  "sub": "~ flap flap flap ~",
  "marquee": "Press SPACE or click to flap *** Dodge the pipes *** Play it below ***",
  "body": "A Flappy Bird remake for MAC 280 (Videogame Programming). Three small C# scripts run the game: BirdScript flaps the bird with a Rigidbody2D whenever you hit Space, PipeSpawnerScript spawns a new pipe every 2 seconds at a random height, and PipeScript slides the pipes left and deletes them once they're off screen.",
  "tags": [
   "Unity",
   "CSharp",
   "GameDev",
   "Rigidbody2D"
  ],
  "media": "fun-flappy.gif",
  "placeholder": true,
  "video": "H0MAK-MvcbE",
  "source": "https://github.com/carlosz98/FlappyBird-Project---Unity",
  "theme": "sky",
  "toy": "flappy"
 },
 "win98-v1": {
  "name": "Win98Blog v1",
  "title": "Win98 Blog v1: where it started",
  "sub": "~ where it all started ~",
  "marquee": "Version 1 *** React + Vite *** The first Windows on my site ***",
  "body": "The very first version of this site. I started from an open-source Windows 95 portfolio template built in React and Vite (by yuteoctober) and filled it with my own bio, resume and projects. It was my first time working in a big React codebase, and everything you see here today grew out of it.",
  "tags": [
   "React",
   "Vite",
   "JavaScript",
   "RetroUI"
  ],
  "media": "win98blog-v1.gif",
  "placeholder": false,
  "video": null,
  "source": "https://github.com/carlosz98/Win98---Blog",
  "theme": "dots",
  "toy": null
 },
 "ecommerce": {
  "name": "ECommerce",
  "title": "Sweater Shop: a SwiftUI store",
  "sub": "~ the comfiest store on iOS ~",
  "marquee": "8 sweaters *** A cart with a running total *** Checkout without paying a cent ***",
  "body": "A small iOS storefront for iOS Development class practice. You browse a grid of 8 sweaters, add them to a cart that keeps a running total, and check out through a simulated payment that clears the cart and shows a success screen. It's split the SwiftUI way: a Product model, a CartManager ObservableObject that publishes cart state to every view, a PaymentHandler that completes asynchronously, and reusable product card, cart row and button components.",
  "tags": [
   "Swift",
   "SwiftUI",
   "iOS",
   "ObservableObject"
  ],
  "media": "fun-shop.gif",
  "placeholder": true,
  "video": null,
  "source": "https://github.com/carlosz98/E-Commerce-App",
  "theme": "checker",
  "toy": null
 },
 "win98-v2": {
  "name": "Win98Blog v2",
  "title": "Win98 Blog v2 on Framer",
  "sub": "~ version 2, made in Framer ~",
  "marquee": "Retro boot screen *** Media Player *** Paint *** Pinball ***",
  "body": "Version two of the blog, built in Framer. It opens with a retro start-up screen, then lands on a Windows 98 desktop. My Computer lists the parts of the PC I use, and there's a web portfolio, a music player, Windows Media Player, Old Net links, Paint, retro news, Pinball, a wallpaper setting and a landing page.",
  "tags": [
   "Framer",
   "UIUX",
   "WebDesign",
   "RetroUI"
  ],
  "media": "fun-framer.gif",
  "placeholder": true,
  "video": null,
  "source": "https://github.com/carlosz98/Windows98---Blog",
  "theme": "dots",
  "toy": null
 },
 "warm-rain": {
  "name": "WarmRain UE5",
  "title": "Warm Rain of Summer: the 51-page design doc",
  "sub": "~ a summer road trip across South America ~",
  "marquee": "Unreal Engine 5 *** 51 page design doc *** a rescued cat and a stray dog ***",
  "body": "My Unreal Engine 5 game, built alongside Epic's official UE5 course. A young man tired of his routine leaves it all behind, takes over his uncle's countryside farm and travels across South America by bike and an old van, with a rescued cat and a stray dog who join him on the road. The 51-page Game Design Document covers the three pillars (Exploration, Movement, Story), quests, a Polaroid album you decorate with your photos, camping nights, pet customization, the world, characters, levels and UI.",
  "tags": [
   "UnrealEngine5",
   "GameDesign",
   "GDD",
   "Blueprints",
   "Storytelling"
  ],
  "media": "warm-rain-gdd.gif",
  "placeholder": false,
  "video": null,
  "source": "https://github.com/carlosz98",
  "theme": "sky",
  "toy": null
 },
 "pixel-city": {
  "name": "PixelCity",
  "title": "2D Pixel Art City in Unity",
  "sub": "~ a neon city, one pixel at a time ~",
  "marquee": "Tilemaps *** Sprite sheets *** Traffic and street life *** In progress ***",
  "body": "A living 2D pixel-art city I'm building in Unity for Game Programming: neon storefronts, traffic and street life made from custom sprite sheets and tilemaps, with animated characters and cars moving through the streets.",
  "tags": [
   "Unity",
   "PixelArt",
   "Tilemaps",
   "SpriteAnimation"
  ],
  "media": "fun-pixel.gif",
  "placeholder": true,
  "video": null,
  "source": "https://github.com/carlosz98",
  "theme": "checker",
  "toy": null
 },
 "portfolio": {
  "name": "MyPortfolio",
  "title": "My portfolio, hand-built",
  "sub": "~ hand-made, no framework ~",
  "marquee": "Plain HTML, CSS and JS *** Press / for the terminal *** Light and dark theme ***",
  "body": "My portfolio at carlosz98.github.io/MyPortFolio, written in plain HTML, CSS and JavaScript with no framework and no build step. Under the warm editorial look there's a skills constellation drawn on canvas, a light/dark theme that remembers your choice, a retro terminal you open with the / key, a typing robot guide, project filters, scroll reveals, a custom cursor and a live 'last commit' badge from the GitHub API.",
  "tags": [
   "HTML",
   "CSS",
   "JavaScript",
   "Canvas",
   "GitHubPages"
  ],
  "media": "my-portfolio.gif",
  "placeholder": false,
  "video": null,
  "source": "https://github.com/carlosz98/MyPortFolio",
  "theme": "stars",
  "toy": null
 },
 "win98blog": {
  "name": "Win98Blog",
  "title": "Win98Blog: the site you're on",
  "sub": "~ you are HERE ~",
  "marquee": "Version 3 *** The site you are using right now *** 30 desktop icons and counting ***",
  "body": "Version three, and the one you're using right now: a Windows 98 desktop in the browser, built with React and Vite. It has a BIOS boot screen, draggable windows, a Start menu and taskbar, and 30 desktop icons, including this DevFeed and the Scrapbook (Firebase, and only I can post), Winamp, CarlosBot on MSN, Paint, Minesweeper, Doom, a 3D magazine, a visitor map and a guestbook.",
  "tags": [
   "React",
   "Vite",
   "Firebase",
   "FramerMotion",
   "RetroUI"
  ],
  "media": "win98blog-tour.gif",
  "placeholder": false,
  "video": "ZP-KHYRXtqI",
  "source": "https://github.com/carlosz98/Win98Blog",
  "theme": "dots",
  "toy": null
 },
 "retrohub": {
  "name": "RetroHub",
  "title": "RetroHub: a social app for retro gamers",
  "sub": "~ the social app for retro gamers ~",
  "marquee": "Feed *** DMs *** Game database *** Streams *** Magazines *** XP levels ***",
  "body": "RetroHub started as my Android class final and grew into a full social platform for retro gaming fans, built in Kotlin and Jetpack Compose on Firebase. It has a community feed, real-time DMs and group chats, a game database powered by IGDB with YouTube trailers, Twitch and YouTube streams, a magazine reader with reading progress, shelves and reviews, soundtrack albums, and profiles with XP levels, an activity heatmap and a gaming-personality radar chart, all in a comic scrapbook style.",
  "tags": [
   "Android",
   "Kotlin",
   "JetpackCompose",
   "Firebase",
   "MVVM"
  ],
  "media": "fun-android.gif",
  "placeholder": true,
  "video": "AdAOmZPQE8Q",
  "source": "https://github.com/carlosz98/AndroidDevelopment_Retro_FinalProject",
  "theme": "checker",
  "toy": null
 }
};
