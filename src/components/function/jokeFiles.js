// Funny "deleted" files that live in the Recycle Bin.
export const JOKE_FILES = {
  old_code: {
    type: '.js',
    text: `// old_code_FINAL_v2.js
// (not to be confused with old_code_FINAL, old_code_FINAL_v1 or old_code_REAL_FINAL)

function doTheThing() {
  // TODO: figure out what the thing is
  return doTheThing(); // works on my machine
}

// Deleted because: it was 3 AM and I named a variable "stuff2".`,
  },
  bugs: {
    type: '.txt',
    text: `BUGS TO FIX
===========
1. Fixed the bug.
2. Fixing the bug created 3 new bugs.
3. See item 1.

99 little bugs in the code,
99 little bugs.
Take one down, patch it around,
127 little bugs in the code.`,
  },
  my_site: {
    type: '.html',
    text: `<html>
<body bgcolor="#00FF00">
<marquee><blink>WELCOME 2 MY HOMEPAGE!!!</blink></marquee>
<img src="under_construction.gif">
<p>You are visitor #000001 (it's me, I refreshed)</p>
<embed src="midi_song.mid" autostart="true" loop="true">
</body>
</html>

<!-- Deleted for crimes against web design. -->`,
  },
  excuses: {
    type: '.txt',
    text: `TOP EXCUSES WHEN THE DEMO BREAKS
1. "It worked five minutes ago."
2. "That's not a bug, it's a feature."
3. "Must be a caching issue."
4. "Have you tried turning it off and on again?"
5. "The intern did it." (I was the intern.)`,
  },
  passwords: {
    type: '.txt',
    text: `Nice try. 😏

There are no passwords here.
But since you're curious, you should really check out the rest of the site.
Try typing "matrix" or "bsod" in Start > Run...`,
  },
};
