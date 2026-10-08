import myCatMp4 from '../../assets/my-cat.mp4';
import myCatWebm from '../../assets/my-cat.webm';

// What the taskbar cat banner shows when clicked.
// To swap it: drop the file in src/assets, import it here,
// and set type to 'image' (jpg/png/gif) or 'video'. A video lists its
// sources in order; the browser plays the first one it supports.
export const MY_CAT = {
  name: 'Mochi',
  type: 'video',
  sources: [myCatWebm, myCatMp4],
  caption: 'No time spent with a cat is wasted.',
};
