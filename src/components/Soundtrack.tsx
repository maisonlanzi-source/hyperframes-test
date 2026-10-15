import React from 'react';
import {Audio, interpolate, Sequence, staticFile} from 'remotion';
import manifest from '../audio-manifest.json';
import {TOTAL_DURATION} from '../constants';

type VoiceClip = {src: string; from: number; durationInFrames: number};
type Music = {src: string; volume?: number};

const voice = manifest.voice as Record<string, VoiceClip>;
const music = manifest.music as Music | null;
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

/** Voix off et musique décrites dans src/audio-manifest.json (vide = vidéo muette). */
export const Soundtrack: React.FC = () => (
	<>
		{clips.map((c) => (
			<Sequence key={c.src} from={c.from} durationInFrames={c.durationInFrames} layout="none">
				<Audio src={staticFile(c.src)} />
			</Sequence>
		))}
		{music ? (
			<Audio
				src={staticFile(music.src)}
				volume={(f) => {
					const base = music.volume ?? 0.25;
					const fadeOut = interpolate(f, [TOTAL_DURATION - 45, TOTAL_DURATION], [1, 0], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					});
					return base * (1 - (1 - DUCK) * duckAt(f)) * fadeOut;
				}}
			/>
		) : null}
	</>
);
