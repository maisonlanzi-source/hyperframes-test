// Toutes les constantes de la vidéo : couleurs, formats et minutages.
// Les minutages sont en images (30 images/s). Les « beats » d'une scène
// sont relatifs au début de cette scène.

import manifest from './audio-manifest.json';

export const FPS = 30;
const s = (seconds: number) => Math.round(seconds * FPS);

export const COLORS = {
	night: '#0B3D91',
	blue: '#0F4CB5',
	yellow: '#F2B705',
	yellowLight: '#F9DB82',
	white: '#FFFFFF',
	lightBlue: '#D9E4F8',
} as const;

// Espace insécable.
export const NB = ' ';

export type Format = '9x16' | '4x5';

export type Layout = {
	width: number;
	height: number;
	/** Marge latérale. */
	side: number;
	/** Haut de la zone utile (sous l'interface de Meta en 9:16). */
	safeTop: number;
	/** Bas de la zone utile. */
	safeBottom: number;
	logoSize: number;
	/** Haut de la zone de contenu quand le logo est affiché. */
	contentTop: number;
};

const LOGO_SIZE = 130;

export const LAYOUTS: Record<Format, Layout> = {
	// 9:16 : rien dans les 250 px du haut ni dans les 560 px du bas, 70 px sur les côtés.
	'9x16': {
		width: 1080,
		height: 1920,
		side: 70,
		safeTop: 250,
		safeBottom: 1920 - 560,
		logoSize: LOGO_SIZE,
		contentTop: 250 + LOGO_SIZE + 40,
	},
	// 4:5 : fil d'actualité, simples marges.
	'4x5': {
		width: 1080,
		height: 1350,
		side: 70,
		safeTop: 70,
		safeBottom: 1350 - 70,
		logoSize: LOGO_SIZE,
		contentTop: 70 + LOGO_SIZE + 40,
	},
};

// Durée minimale de chaque scène, en secondes. Si la voix off a été générée,
// src/audio-manifest.json donne les durées allongées pour que chaque phrase tienne.
const MIN_SECONDS = {
	hook: 4,
	promise: 3,
	budget: 7,
	afterDegree: 6,
	language: 5,
	deadline: 5,
	summary: 5,
	cta: 8,
};
type SceneKey = keyof typeof MIN_SECONDS;
const fromManifest = (manifest as {scenes?: Partial<Record<SceneKey, number>>}).scenes ?? {};

// Découpage des scènes (début et durée, en images).
export const SCENES = (() => {
	let from = 0;
	const out = {} as Record<SceneKey, {from: number; duration: number}>;
	for (const key of Object.keys(MIN_SECONDS) as SceneKey[]) {
		const duration = s(Math.max(MIN_SECONDS[key], fromManifest[key] ?? 0));
		out[key] = {from, duration};
		from += duration;
	}
	return out;
})();

export const TOTAL_DURATION = SCENES.cta.from + SCENES.cta.duration;

// Durée du fondu de sortie de chaque scène.
export const SCENE_FADE_OUT = 8;

// Le logo apparaît avec la scène 2.
export const LOGO_IN = SCENES.promise.from + 6;

// Les cercles du fond et les flottements ralentissent puis s'arrêtent
// ici, pour que l'image finale reste fixe plus de 2 secondes.
export const FREEZE_START = TOTAL_DURATION - s(5);
export const FREEZE_LENGTH = s(2.6); // immobile 2,4 s avant la fin

// Beats internes de chaque scène (images, relatifs au début de la scène).
export const BEATS = {
	hook: {
		wordsStart: 0,
		wordStep: 4,
		bigQuestion: 34,
		cards: 52,
		questionMark: 64,
	},
	promise: {
		text: 4,
	},
	budget: {
		title: 4,
		franceBar: 22,
		canadaBar: 40,
		barDuration: 40,
		conclusion: 92,
		note: 108,
	},
	afterDegree: {
		title: 4,
		france: 24,
		canada: 44,
	},
	language: {
		title: 4,
		france: 22,
		canada: 40,
	},
	deadline: {
		title: 4,
		france: 20,
		pageFlip: 30,
		pageFlipDuration: 22,
		circle: 52,
		circleDuration: 18,
		canada: 64,
	},
	summary: {
		title: 4,
		line1: 18,
		arrow1: 30,
		conclusion1: 46,
		line2: 58,
		arrow2: 70,
		conclusion2: 86,
		arrowDuration: 16,
	},
	cta: {
		intro: 0,
		checksStart: 16,
		checkStep: 9,
		listOut: 84,
		listOutDuration: 12,
		mockup: 92,
		title: 104,
		subtitle: 114,
		button: 124,
		lastLine: 134,
	},
} as const;
