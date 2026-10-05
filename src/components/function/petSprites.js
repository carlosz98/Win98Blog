// Pixel-art frames for the desktop dog (facing right). Each string is one row.
// k outline, g fur, d dark fur (ear), l light belly, n nose, t tongue, c collar, z sleep "z"
export const PET_PALETTE = {
  k: '#3b2412', g: '#d9a441', d: '#a8701f', l: '#f4dc9c', n: '#111111', t: '#e86a7a', c: '#c0262d', w: '#ffffff', z: '#ffffff',
};

const HEAD = [
  '................kkkkk...',
  '...............kgggggk..',
  '..............kgggggggk.',
  '..............kggkggggkk',
  '.............kdkgggggggn',
  '.............kddkggggkkk',
  '.............kddkgttk...',
];

export const PET_FRAMES = {
  walk1: [
    ...HEAD,
    '...kk........kddkkkk....',
    '...kgk.kkkkkkkccccck....',
    '....kgkgggggggggggggk...',
    '....kggggggggggggggk....',
    '....kggggggggggggggk....',
    '....klllllllllllgggk....',
    '....kggk.......kggk.....',
    '...kggk.........kggk....',
    '...kkk...........kkk....',
  ],
  walk2: [
    ...HEAD,
    '....kk.......kddkkkk....',
    '....kgkkkkkkkkccccck....',
    '....kgkgggggggggggggk...',
    '....kggggggggggggggk....',
    '....kggggggggggggggk....',
    '....klllllllllllgggk....',
    '.....kggk.....kggk......',
    '.....kggk.....kggk......',
    '.....kkk......kkk.......',
  ],
  sit: [
    '........................',
    ...HEAD,
    '.............kddkkkk....',
    '...........kkkcccck.....',
    '..........kggggggk......',
    '..kk.....kgggggggk......',
    '..kgk...kggggllggk......',
    '...kgk.kggggglllgk......',
    '....kgkgggggglllgk......',
    '....kkkkkkkkkkkkkk......',
  ],
  sleep: [
    '................zz......',
    '..................z.....',
    '........................',
    '........................',
    '........................',
    '........................',
    '........................',
    '...............kkkkk....',
    '..kk..........kgggggkk..',
    '..kgkkkkkkkkkkkdkggggknk',
    '...kgggggggggkddkkggggkk',
    '...kgggggggggkddkgggggk.',
    '...kllllllllllkkkkkkkk..',
    '..kkkkkkkkkkkkkkkkkkk...',
    '........................',
    '........................',
  ],
};
