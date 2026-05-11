#!/usr/bin/env node
// Copies the SPA index.html to 404.html so GitHub Pages can serve the Angular
// app on cold hits to any sub-path (e.g. /home, /contains). Without this,
// direct navigation or page refresh on a non-root URL returns the GH 404 page.

import { copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'dsp-function-documentation');
const src = join(OUT, 'index.html');
const dest = join(OUT, '404.html');

if (!existsSync(src)) {
  console.error(`copy-404: source not found: ${src}`);
  process.exit(1);
}

copyFileSync(src, dest);
console.log(`Copied ${src} -> ${dest}`);
