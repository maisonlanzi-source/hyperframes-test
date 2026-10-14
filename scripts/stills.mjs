// Exporte une image fixe au milieu de chaque scène (contrôle visuel).
// Usage : node scripts/stills.mjs [9x16|4x5] [dossier] [images...]
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const format = process.argv[2] ?? '9x16';
const outDir = process.argv[3] ?? 'out/apercus';
const extra = process.argv.slice(4).map(Number);

const FPS = 30;
const SCENES = [
	['1-accroche', 0, 4],
	['2-promesse', 4, 7],
	['3-budget', 7, 14],
	['4-apres-diplome', 14, 20],
	['5-langue', 20, 25],
	['6-calendrier', 25, 30],
	['7-resume', 30, 35],
	['8-appel-action', 35, 43],
];

const shell =
	process.env.REMOTION_BROWSER ??
	'/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browserExecutable = fs.existsSync(shell) ? shell : null;

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({
	serveUrl,
	id: `FranceOuCanada-${format}`,
	browserExecutable,
});
fs.mkdirSync(outDir, {recursive: true});

const jobs = extra.length
	? extra.map((f) => [`frame-${String(f).padStart(4, '0')}`, f])
	: SCENES.map(([name, a, b]) => [`scene-${name}`, Math.round(((a + b) / 2) * FPS)]);

for (const [name, frame] of jobs) {
	const output = path.join(outDir, `${name}.png`);
	await renderStill({composition, serveUrl, output, frame, browserExecutable, imageFormat: 'png'});
	console.log(`${output} (image ${frame})`);
}
