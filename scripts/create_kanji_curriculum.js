const fs = require('fs');
const path = require('path');

const KANJI_DIR = path.resolve(__dirname, '../my-learning-hub/src/content/docs/japanese-kanji');
fs.mkdirSync(KANJI_DIR, { recursive: true });

console.log('Writing N1 Kanji Curriculum files...');
