import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import path from 'path';

// Copy manifest.json to dist folder
const manifest = readFileSync('./public/manifest.json', 'utf8');
writeFileSync('./dist/manifest.json', manifest);

// Copy icons to dist folder
// (You'd need to implement this part based on your icon files)

// Fix asset paths in HTML files
const htmlFiles = globSync('./dist/*.html');
for (const file of htmlFiles) {
  let html = readFileSync(file, 'utf8');
  
  // Replace asset paths
  html = html.replace(/src="\/assets\//g, 'src="./assets/');
  html = html.replace(/href="\/assets\//g, 'href="./assets/');
  
  writeFileSync(file, html);
}

// Rename entry files to match manifest expectations
const entryMap = {
  'popup.js': 'popup.js',
  'dashboard.js': 'dashboard.js',
  'background.js': 'background.js',
  'contentScript.js': 'contentScript.js'
};

// You'd implement file renaming here if needed