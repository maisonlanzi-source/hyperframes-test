// Génère la voix off scène par scène avec ElevenLabs, puis écrit
// src/audio-manifest.json pour que la vidéo l'intègre au rendu.
//
// Usage :
//   npm run voix -- --list            liste les voix du compte (nom, accent, id)
//   npm run voix                      génère les 8 fichiers de voix
//
// Variables d'environnement :
//   ELEVENLABS_API_KEY   (obligatoire) clé API, à définir dans les réglages de l'environnement
//   ELEVENLABS_VOICE_ID  (obligatoire pour générer) id de la voix choisie
//   ELEVENLABS_MODEL_ID  (facultatif) modèle, par défaut eleven_multilingual_v2
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const API = 'https://api.elevenlabs.io/v1';
const FPS = 30;

// Début et durée de chaque scène, en secondes (voir src/constants.ts).
// Texte : version resserrée de voix-off.txt, calibrée pour 43 s.
const SCENES = [
	{key: 'hook', start: 0, duration: 4, text: 'Votre enfant a le bac cette année ? France ou Canada ?'},
	{key: 'promise', start: 4, duration: 3, text: 'Voici comment choisir, en quatre questions.'},
	{
		key: 'budget',
		start: 7,
		duration: 7,
		text: 'Un : le budget. Six à huit millions de francs CFA en France, seize à vingt-quatre au Canada.',
	},
	{
		key: 'afterDegree',
		start: 14,
		duration: 6,
		text: "Deux : l'après-diplôme. Le Canada ouvre un chemin plus clair vers le travail et la résidence.",
	},
	{
		key: 'language',
		start: 20,
		duration: 5,
		text: 'Trois : la langue. Français en France ; surtout anglais au Canada, sauf au Québec.',
	},
	{
		key: 'deadline',
		start: 25,
		duration: 5,
		text: 'Quatre : le calendrier. En France, dossier de Licence 1 avant le 15 décembre.',
	},
	{
		key: 'summary',
		start: 30,
		duration: 5,
		text: 'En résumé : moins de huit millions, la France. Seize millions et plus, le Canada.',
	},
	{
		key: 'cta',
		start: 35,
		duration: 8,
		text: 'Procédure, preuve de fonds, lettre, entretien : tout est dans le guide. Neuf mille neuf cents francs CFA. Appuyez sur le bouton sous la vidéo.',
	},
];

// Décalage de la voix après le début de la scène, et marge avant la fin.
const LEAD_IN = 0.2;
const TAIL = 0.15;
// Accélération maximale tolérée si une phrase déborde de sa scène.
const MAX_SPEED = 1.15;

const key = process.env.ELEVENLABS_API_KEY;
if (!key) {
	console.error(
		"ELEVENLABS_API_KEY n'est pas définie. Ajoutez-la dans les réglages de l'environnement, puis ouvrez une nouvelle session.",
	);
	process.exit(1);
}

const api = async (url, init = {}) => {
	const res = await fetch(`${API}${url}`, {
		...init,
		headers: {'xi-api-key': key, 'Content-Type': 'application/json', ...init.headers},
	});
	if (!res.ok) {
		throw new Error(`ElevenLabs ${res.status} : ${await res.text()}`);
	}
	return res;
};

if (process.argv.includes('--list')) {
	const {voices} = await (await api('/voices')).json();
	for (const v of voices) {
		const l = v.labels ?? {};
		console.log(
			[v.name, l.language, l.accent, l.gender, l.age, l.description].filter(Boolean).join(' · '),
			`\n    id : ${v.voice_id}`,
		);
	}
	process.exit(0);
}

const voiceId = process.env.ELEVENLABS_VOICE_ID;
if (!voiceId) {
	console.error('ELEVENLABS_VOICE_ID manquant : choisissez une voix avec `npm run voix -- --list`.');
	process.exit(1);
}
const modelId = process.env.ELEVENLABS_MODEL_ID ?? 'eleven_multilingual_v2';

const outDir = path.resolve('public/audio');
fs.mkdirSync(outDir, {recursive: true});

const duration = (file) =>
	Number(
		execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file])
			.toString()
			.trim(),
	);

const synth = async (i, speed) => {
	const s = SCENES[i];
	const res = await api(`/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
		method: 'POST',
		body: JSON.stringify({
			text: s.text,
			model_id: modelId,
			// Contexte des phrases voisines, pour une intonation continue.
			previous_text: SCENES[i - 1]?.text,
			next_text: SCENES[i + 1]?.text,
			voice_settings: {stability: 0.45, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true, speed},
		}),
	});
	const file = path.join(outDir, `voix-${i + 1}-${s.key}.mp3`);
	fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
	return file;
};

const manifest = {voice: {}, music: null};
const previous = 'src/audio-manifest.json';
if (fs.existsSync(previous)) {
	manifest.music = JSON.parse(fs.readFileSync(previous, 'utf8')).music ?? null;
}

for (let i = 0; i < SCENES.length; i++) {
	const s = SCENES[i];
	const max = s.duration - LEAD_IN - TAIL;
	let speed = 1;
	let file = await synth(i, speed);
	let d = duration(file);
	if (d > max) {
		speed = Math.min(MAX_SPEED, Math.ceil((d / max) * 100) / 100);
		file = await synth(i, speed);
		d = duration(file);
	}
	const fits = d <= max;
	console.log(
		`${fits ? 'ok ' : '⚠  '} scène ${i + 1} : ${d.toFixed(2)} s / ${max.toFixed(2)} s disponibles` +
			(speed !== 1 ? ` (vitesse ${speed})` : ''),
	);
	manifest.voice[s.key] = {
		src: `audio/${path.basename(file)}`,
		from: Math.round((s.start + LEAD_IN) * FPS),
		durationInFrames: Math.ceil(d * FPS),
	};
}

fs.writeFileSync(previous, JSON.stringify(manifest, null, '\t') + '\n');
console.log(`\nManifeste écrit : ${previous}. Relancez le rendu : npm run render`);
