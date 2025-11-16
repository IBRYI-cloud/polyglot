const fs = require('fs-extra');
const path = require('path');

const srcDir = path.resolve(__dirname, 'locales');
const destDir = path.resolve(__dirname, 'dist', 'locales');

async function copyFiles() {
  try {
    await fs.copy(srcDir, destDir);
    console.log('Locales copied successfully!');
  } catch (err) {
    console.error('Error copying locales:', err);
  }
}

copyFiles();