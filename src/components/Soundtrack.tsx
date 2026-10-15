import React from 'react';
import {Audio, interpolate, Sequence, staticFile} from 'remotion';
import manifest from '../audio-manifest.json';
import {BEATS, SCENES, TOTAL_DURATION} from '../constants';

type VoiceClip = {src: string; from: number; durationInFrames: number};
type Music = {src: string; volume?: number};
type SfxName = 'whoosh' | 'pop' | 'tick' | 'page' | 'marker' | 'impact' | 'chime';

const voice = manifest.voice as Record<string, VoiceClip>;
const music = manifest.music as Music | null;
const sfx = ((manifest as {sfx?: unknown}).sfx ?? {}) as Partial<Record<SfxName, string>>;
const clips = Object.values(voice);

// La musique baisse pendant la voix (fondu de 8 images).
const DUCK = 0.35;
const RAMP = 8;
const duckAt = (frame: number) =>
	clips.reduce((v, c) => {
		const end = c.from + c.durationInFrames;
		const inside = interpolate(
			frame,
			[c.from - RAMP, c.from, end, end + RAMP],
			[0, 1, 1, 0],
			{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
		);
		return Math.max(v, inside);
	}, 0);

// Bruitages, calés sur les animations : [son, image absolue, volume].
type Cue = [SfxName, number, number];
const at = (scene: keyof typeof SCENES, beat: number) => SCENES[scene].from + beat;

const CUES: Cue[] = [
	['impact', 0, 0.45],
	// Une transition à chaque changement de scène, juste avant la coupe.
	...(Object.keys(SCENES) as Array<keyof typeof SCENES>)
		.slice(1)
		.map((k): Cue => ['whoosh', SCENES[k].from - 6, 0.3]),
	['pop', at('hook', BEATS.hook.cards), 0.3],
	['pop', at('hook', BEATS.hook.questionMark), 0.35],
	['pop', at('budget', BEATS.budget.franceBar), 0.25],
	['pop', at('budget', BEATS.budget.canadaBar), 0.25],
	['pop', at('afterDegree', BEATS.afterDegree.france), 0.25],
	['pop', at('afterDegree', BEATS.afterDegree.canada), 0.25],
	['pop', at('language', BEATS.language.france), 0.25],
	['pop', at('language', BEATS.language.canada), 0.25],
	['pop', at('deadline', BEATS.deadline.france), 0.25],
	['page', at('deadline', BEATS.deadline.pageFlip), 0.4],
	['marker', at('deadline', BEATS.deadline.circle), 0.35],
	['pop', at('deadline', BEATS.deadline.canada), 0.25],
	['tick', at('summary', BEATS.summary.conclusion1), 0.3],
	['tick', at('summary', BEATS.summary.conclusion2), 0.3],
	...[0, 1, 2, 3].map(
		(i): Cue => ['tick', at('cta', BEATS.cta.checksStart + i * BEATS.cta.checkStep), 0.28],
	),
	['whoosh', at('cta', BEATS.cta.mockup) - 4, 0.3],
	['chime', at('cta', BEATS.cta.button), 0.4],
];

/** Voix off, musique et bruitages décrits dans src/audio-manifest.json (vide = vidéo muette). */
export const Soundtrack: React.FC = () => (
	<>
		{clips.map((c) => (
			<Sequence key={c.src} from={c.from} durationInFrames={c.durationInFrames} layout="none">
				<Audio src={staticFile(c.src)} />
			</Sequence>
		))}
		{CUES.map(([name, from, volume], i) =>
			sfx[name] ? (
				<Sequence key={i} from={Math.max(0, from)} layout="none">
					<Audio src={staticFile(sfx[name])} volume={volume} />
				</Sequence>
			) : null,
		)}
		{music ? (
			<Audio
				src={staticFile(music.src)}
				volume={(f) => {
					const base = music.volume ?? 0.25;
					const fadeIn = interpolate(f, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
					const fadeOut = interpolate(f, [TOTAL_DURATION - 45, TOTAL_DURATION], [1, 0], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					});
					return base * (1 - (1 - DUCK) * duckAt(f)) * fadeIn * fadeOut;
				}}
			/>
		) : null}
	</>
);
