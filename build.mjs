// TehsilOS front end: src/ → os/app.js + os/app.css  (node build.mjs)
import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';
const V = /VERSION = '([^']+)'/.exec(readFileSync('src/core/config.js', 'utf8'))[1];
await build({ entryPoints: { app: 'src/main.js' }, bundle: true, format: 'esm', minify: true, target: ['es2020', 'safari14'], outdir: 'os', external: ['*.woff2'], legalComments: 'none', logLevel: 'warning' });
writeFileSync('version.json', JSON.stringify({ v: V }) + '\n');
let h = readFileSync('app.html', 'utf8').replace(/os\/app\.(css|js)\?v=[^"]+/g, (m, x) => 'os/app.' + x + '?v=' + V); writeFileSync('app.html', h);
let sw = readFileSync('sw.js', 'utf8').replace(/os\/app\.(css|js)\?v=[^']+/g, (m, x) => 'os/app.' + x + '?v=' + V); writeFileSync('sw.js', sw);
console.log('built', V);
