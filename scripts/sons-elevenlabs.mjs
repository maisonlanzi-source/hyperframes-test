// Génère la musique de fond et les bruitages avec ElevenLabs, puis les
// déclare dans src/audio-manifest.json. Leur placement dans la vidéo est
// décrit dans src/components/Soundtrack.tsx (calé sur les animations).
//
// Usage :
//   npm run sons                  musique + bruitages
//   npm run sons -- --sfx         bruitages seulement
//   npm run sons -- --music       musique seulement
//
// À lancer après `npm run voix` : la musique est taillée sur la durée de la vidéo.
import fs from 'node:fs';
import path from 'node:path';

const API = 'https://api.elevenlabs.io/v1';
const key = process.env.ELEVENLABS_API_KEY || 'proxy-injected';

const SFX = {
	whoosh: {seconds: 0.8, prompt: 'soft airy whoosh swipe transition, clean modern motion design, short'},
	pop: {seconds: 0.5, prompt: 'soft bubbly UI pop, light and friendly, clean, short'},
	tick: {seconds: 0.5, prompt: 'crisp positive checkmark UI tick sound, clean, short'},
	page: {seconds: 0.8, prompt: 'single paper page flip, crisp, close microphone'},
	marker: {seconds: 0.8, prompt: 'felt marker quickly circling on paper, short scribble'},
	impact: {seconds: 1.2, prompt: 'soft cinematic hit with gentle shimmer, modern intro accent, not aggressive'},
	chime: {seconds: 1.8, prompt: 'bright uplifting success chime, warm marimba and bell, short logo sting'},
};

const MUSIC_PROMPT =
	'Instrumental background music for an educational advertisement aimed at West African parents. ' +
	'Warm, optimistic, modern afro-pop groove with light percussion, kalimba, soft guitar and gentle bass. ' +
	'Steady medium tempo around 100 BPM, positive and trustworthy, not distracting, no vocals, clean ending.';

const api = async (url, body, tries = 5) => {
	for (let attempt = 1; ; attempt++) {
		const res = await fetch(`${API}${url}`, {
			method: 'POST',
			headers: {'xi-api-key': key, 'Content-Type': 'application/json'},
			body: JSON.stringify(body),
		});
		if (res.ok) return Buffer.from(await res.arrayBuffer());
		const text = await res.text();
		if ((res.status === 429 || res.status >= 500) && attempt < tries) {
			const wait = 5 * 2 ** (attempt - 1);
			console.log(`  ElevenLabs occupé (${res.status}), nouvel essai dans ${wait} s…`);
			await new Promise((r) => setTimeout(r, wait * 1000));
			continue;
		}
		throw new Error(`ElevenLabs ${res.status} : ${text}`);
	}
};

const manifestPath = 'src/audio-manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const outDir = path.resolve('public/audio');
fs.mkdirSync(outDir, {recursive: true});

const only = process.argv.includes('--sfx') ? 'sfx' : process.argv.includes('--music') ? 'music' : null;

if (only !== 'music') {
	manifest.sfx = {};
	for (const [name, {seconds, prompt}] of Object.entries(SFX)) {
		const buf = await api('/sound-generation', {text: prompt, duration_seconds: seconds, prompt_influence: 0.5});
		fs.writeFileSync(path.join(outDir, `sfx-${name}.mp3`), buf);
		manifest.sfx[name] = `audio/sfx-${name}.mp3`;
		console.log(`bruitage : ${name}`);
	}
}

if (only !== 'sfx') {
	const total = Object.values(manifest.scenes ?? {}).reduce((a, b) => a + b, 0) || 43;
	const ms = Math.ceil(total + 2) * 1000;
	const buf = await api('/music', {prompt: MUSIC_PROMPT, music_length_ms: ms});
	fs.writeFileSync(path.join(outDir, 'musique.mp3'), buf);
	manifest.music = {src: 'audio/musique.mp3', volume: manifest.music?.volume ?? 0.22};
	console.log(`musique : ${ms / 1000} s`);
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, '\t') + '\n');
console.log(`\nManifeste mis à jour : ${manifestPath}. Relancez le rendu : npm run render`);
