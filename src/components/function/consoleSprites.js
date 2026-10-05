// Pixel art for Carlos's console collection (About > Hobby).
// Each row is a string; every letter is a color from PALETTE, '.' is transparent.
// `video` is an optional link Carlos can add later; clicking the console opens it.

export const PALETTE = {
  K: '#000000', // outline
  G: '#b8b8b8', // light gray
  g: '#8a8a8a', // gray
  D: '#3a3a3a', // dark gray
  B: '#1c1c1c', // near black
  W: '#f2f2f2', // white
  w: '#d6d6d6', // off white
  b: '#2a5bd7', // blue
  c: '#4fc3f7', // cyan
  P: '#5b3c9e', // gamecube purple
  p: '#7d5fc4', // light purple
  R: '#d32f2f', // red
  Y: '#f6c90e', // yellow
  N: '#2e7d32', // green
  T: '#26a69a', // teal (3DS)
  t: '#80cbc4', // light teal
  S: '#7a8fa3', // screen gray-blue
  O: '#6b4a2b', // zune brown
  o: '#8d6a45', // light brown
};

export const CONSOLES = [
  {
    id: 'ps1', name: 'PlayStation', year: 1995,
    rows: [
      '......................',
      '.KKKKKKKKKKKKKKKKKKKK.',
      '.KGGGGGGGKKKKKGGGGGGK.',
      '.KGGGGGGKgggggKGGGGGK.',
      '.KGGGGGKgggggggKGGGGK.',
      '.KGGGGGKgggKgggKGRbGK.',
      '.KGGGGGKgggggggKGNYGK.',
      '.KGGGGGGKgggggKGGGGGK.',
      '.KGGGGGGGKKKKKGGGGGGK.',
      '.KGgGgGGGGGGGGGGGGGGK.',
      '.KggggggggggggggggggK.',
      '.KKKKKKKKKKKKKKKKKKKK.',
    ],
  },
  {
    id: 'ps2', name: 'PlayStation 2', year: 2000,
    rows: [
      '......................',
      '.KKKKKKKKKKKKKKKKKKKK.',
      '.KBBBBBBBBBBBBBBBBBBK.',
      '.KBDDDDDDDDDDDDDDDDBK.',
      '.KBBBBBBBBBBBBBBBBBBK.',
      '.KKKKKKKKKKKKKKKKKKKK.',
      '.KBBBBBBBBBBBBBBBBBBK.',
      '.KBDDDDDDDDDDDDDDbbBK.',
      '.KBBBBBBBBBBBBBBBBBBK.',
      '.KKKKKKKKKKKKKKKKKKKK.',
    ],
  },
  {
    id: 'ps3', name: 'PlayStation 3', year: 2006,
    rows: [
      '......................',
      '....KKKKKKKKKKKKKK....',
      '..KKBBBBBBBBBBBBBBKK..',
      '.KBBDDDDDDDDDDDDDDBBK.',
      '.KBBBBBBBBBBBBBBBBBBK.',
      '.KBBBBBBBBBBBBBBBBBBK.',
      '.KgggggggggggggggggggK',
      '.KBBBBBBBBBBBBBBBBcBK.',
      '.KBBBBBBBBBBBBBBBBBBK.',
      '..KKKKKKKKKKKKKKKKKK..',
    ],
  },
  {
    id: 'gamecube', name: 'GameCube', year: 2001,
    rows: [
      '.....KKKKKKKKKKK......',
      '.....KpppppppppK......',
      '...KKKKKKKKKKKKKKK....',
      '...KPPPPPPPPPPPPPK....',
      '...KPPPKKKKKKKPPPK....',
      '...KPPKpppppppKPPK....',
      '...KPPKppKKKppKPPK....',
      '...KPPKpppppppKPPK....',
      '...KPPPKKKKKKKPPPK....',
      '...KPPPPPPPPPPPPPK....',
      '...KPgPPPPPPPPPgPK....',
      '...KKKKKKKKKKKKKKK....',
    ],
  },
  {
    id: 'wii', name: 'Wii', year: 2006,
    rows: [
      '.........KKKKK........',
      '.........KWWWK........',
      '.........KWcWK........',
      '.........KWcWK........',
      '.........KWcWK........',
      '.........KWWWK........',
      '.........KWWWK........',
      '.........KWWWK........',
      '.........KWWWK........',
      '.........KwwwK........',
      '........KKwwwKK.......',
      '........KGGGGGK.......',
      '........KKKKKKK.......',
    ],
  },
  {
    id: '3ds', name: 'Nintendo 3DS', year: 2011,
    rows: [
      '.....KKKKKKKKKKKK.....',
      '.....KTTTTTTTTTTK.....',
      '.....KTKKKKKKKKTK.....',
      '.....KTKSSSSSSKTK.....',
      '.....KTKSccSSSKTK.....',
      '.....KTKKKKKKKKTK.....',
      '.....KKKKKKKKKKKK.....',
      '.....KttttttttttK.....',
      '.....KtDtKKKKtRtK.....',
      '.....KDDDKSSKtttK.....',
      '.....KtDtKKKKtYtK.....',
      '.....KttttttttttK.....',
      '.....KKKKKKKKKKKK.....',
    ],
  },
  {
    id: 'psp', name: 'PSP', year: 2005,
    rows: [
      '......................',
      '...KKKKKKKKKKKKKKKK...',
      '..KBBBBBBBBBBBBBBBBK..',
      '.KBBBKKKKKKKKKKBBBBBK.',
      '.KBDBKSSSSSSSSKBBRBBK.',
      '.KDDDKSSSccSSSKBNBYBK.',
      '.KBDBKSSSSSSSSKBBbBBK.',
      '.KBBBKKKKKKKKKKBBBBBK.',
      '..KBBBBBBBBBBBBBBBBK..',
      '...KKKKKKKKKKKKKKKK...',
    ],
  },
  {
    id: 'vita', name: 'PS Vita', year: 2012,
    rows: [
      '......................',
      '..KKKKKKKKKKKKKKKKKK..',
      '.KBBBBBBBBBBBBBBBBBBK.',
      '.KBDBKKKKKKKKKKBBRBBK.',
      '.KDDDKbbbbbbbbKBNBYBK.',
      '.KBDBKbbccbbbbKBBbBBK.',
      '.KBgBKbbbbbbbbKBBgBBK.',
      '.KBBBKKKKKKKKKKBBBBBK.',
      '..KKKKKKKKKKKKKKKKKK..',
    ],
  },
  {
    id: 'zune', name: 'Zune 30GB', year: 2006,
    rows: [
      '........KKKKKK........',
      '.......KOOOOOOK.......',
      '.......KOKKKKOK.......',
      '.......KOKSSKOK.......',
      '.......KOKScKOK.......',
      '.......KOKSSKOK.......',
      '.......KOKKKKOK.......',
      '.......KOOOOOOK.......',
      '.......KOKKKKOK.......',
      '.......KKooooKK.......',
      '.......KKoKKoKK.......',
      '.......KKooooKK.......',
      '.......KOKKKKOK.......',
      '.......KOOOOOOK.......',
      '........KKKKKK........',
    ],
  },
];
