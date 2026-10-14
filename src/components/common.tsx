import React, {createContext, useContext} from 'react';
import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Inter';
import {
	COLORS,
	FREEZE_LENGTH,
	FREEZE_START,
	Layout,
	LOGO_IN,
	SCENE_FADE_OUT,
} from '../constants';

export const {fontFamily} = loadFont('normal', {
	weights: ['400', '600', '800'],
	subsets: ['latin', 'latin-ext'],
});

export const TYPE = {
	title: {fontFamily, fontWeight: 800, fontSize: 84, lineHeight: 1.12, letterSpacing: -1},
	text: {fontFamily, fontWeight: 600, fontSize: 48, lineHeight: 1.25},
	note: {fontFamily, fontWeight: 400, fontSize: 32, lineHeight: 1.35},
} as const;

export const LayoutContext = createContext<Layout | null>(null);

export const useLayout = (): Layout => {
	const layout = useContext(LayoutContext);
	if (!layout) {
		throw new Error('LayoutContext manquant');
	}
	return layout;
};

/** Spring sans rebond exagéré, terminé en `duration` images. */
export const useSpring = (delay: number, duration = 24) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({
		frame: frame - delay,
		fps,
		config: {damping: 200, mass: 0.8},
		durationInFrames: duration,
	});
};

/** Entrée en fondu avec un glissement de 40 px. */
export const useEnter = (delay: number, from: 'bottom' | 'left' | 'right' = 'bottom') => {
	const p = useSpring(delay);
	const d = (1 - p) * 40;
	const transform =
		from === 'bottom'
			? `translateY(${d}px)`
			: from === 'left'
				? `translateX(${-d}px)`
				: `translateX(${d}px)`;
	return {opacity: p, transform} as const;
};

/**
 * Temps « lent » des éléments qui dérivent : suit le temps réel, puis
 * ralentit en douceur et s'arrête à FREEZE_START + FREEZE_LENGTH / 2.
 */
export const driftTime = (frame: number) => {
	if (frame <= FREEZE_START) {
		return frame;
	}
	const d = Math.min(frame - FREEZE_START, FREEZE_LENGTH);
	return FREEZE_START + d - (d * d) / (2 * FREEZE_LENGTH);
};

/** Fondu de sortie à la fin d'une scène (désactivé pour la dernière). */
export const SceneFade: React.FC<{
	duration: number;
	fadeOut?: boolean;
	children: React.ReactNode;
}> = ({duration, fadeOut = true, children}) => {
	const frame = useCurrentFrame();
	const opacity = fadeOut
		? interpolate(frame, [duration - SCENE_FADE_OUT, duration], [1, 0], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			})
		: 1;
	return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

/**
 * Boîte de contenu dans la zone de sécurité.
 * `withLogo` : commence sous le logo.
 */
export const ContentBox: React.FC<{
	withLogo?: boolean;
	justify?: React.CSSProperties['justifyContent'];
	gap?: number;
	children: React.ReactNode;
}> = ({withLogo = true, justify = 'center', gap = 40, children}) => {
	const l = useLayout();
	const top = withLogo ? l.contentTop : l.safeTop;
	return (
		<div
			style={{
				position: 'absolute',
				left: l.side,
				top,
				width: l.width - 2 * l.side,
				height: l.safeBottom - top,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: justify,
				gap,
			}}
		>
			{children}
		</div>
	);
};

const CIRCLES = [
	{x: 0.95, y: 0.12, r: 430, opacity: 0.5, ax: 40, ay: 30, speed: 0.011, phase: 0},
	{x: 0.02, y: 0.62, r: 520, opacity: 0.45, ax: 50, ay: 40, speed: 0.008, phase: 2},
	{x: 0.85, y: 0.98, r: 380, opacity: 0.55, ax: 35, ay: 45, speed: 0.01, phase: 4},
	{x: 0.3, y: -0.02, r: 260, opacity: 0.4, ax: 30, ay: 20, speed: 0.013, phase: 1},
];

/** Fond bleu nuit et grands cercles qui dérivent lentement. */
export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const t = driftTime(frame);
	return (
		<AbsoluteFill style={{backgroundColor: COLORS.night, overflow: 'hidden'}}>
			{CIRCLES.map((c, i) => {
				const cx = c.x * width + Math.sin(t * c.speed + c.phase) * c.ax;
				const cy = c.y * height + Math.cos(t * c.speed * 0.8 + c.phase) * c.ay;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: cx - c.r,
							top: cy - c.r,
							width: c.r * 2,
							height: c.r * 2,
							borderRadius: '50%',
							backgroundColor: COLORS.blue,
							opacity: c.opacity,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

/** Logo rond, en haut à gauche, à partir de la scène 2. */
export const Logo: React.FC = () => {
	const frame = useCurrentFrame();
	const l = useLayout();
	const p = useSpringAt(frame, LOGO_IN);
	if (frame < LOGO_IN) {
		return null;
	}
	return (
		<Img
			src={staticFile('logo-cap-etudes.png')}
			style={{
				position: 'absolute',
				left: l.side,
				top: l.safeTop,
				width: l.logoSize,
				height: l.logoSize,
				borderRadius: '50%',
				opacity: p,
				transform: `scale(${0.6 + 0.4 * p})`,
				boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
			}}
		/>
	);
};

const useSpringAt = (frame: number, delay: number) => {
	const {fps} = useVideoConfig();
	return spring({
		frame: frame - delay,
		fps,
		config: {damping: 200, mass: 0.8},
		durationInFrames: 24,
	});
};

const MAPLE_LEAF =
	'M10 1 L11.5 4 L13 3.3 L12.4 7.5 L15 5.5 L15.6 7 L18.5 6.5 L17.6 9.5 L19 10.2 L14.8 13.6 L15.4 15.4 L10.6 14.6 L10.7 19 L9.3 19 L9.4 14.6 L4.6 15.4 L5.2 13.6 L1 10.2 L2.4 9.5 L1.5 6.5 L4.4 7 L5 5.5 L7.6 7.5 L7 3.3 L8.5 4 Z';

/** Petits drapeaux simples en SVG. */
export const Flag: React.FC<{country: 'france' | 'canada'; height?: number}> = ({
	country,
	height = 40,
}) => {
	const width = height * 1.5;
	const common = {
		width,
		height,
		style: {borderRadius: 6, flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.25)'},
	};
	if (country === 'france') {
		return (
			<svg {...common} viewBox="0 0 30 20">
				<rect x="0" y="0" width="10" height="20" fill="#1F4AA8" />
				<rect x="10" y="0" width="10" height="20" fill="#FFFFFF" />
				<rect x="20" y="0" width="10" height="20" fill="#E1343F" />
			</svg>
		);
	}
	return (
		<svg {...common} viewBox="0 0 40 20">
			<rect x="0" y="0" width="40" height="20" fill="#FFFFFF" />
			<rect x="0" y="0" width="10" height="20" fill="#E1343F" />
			<rect x="30" y="0" width="10" height="20" fill="#E1343F" />
			<g transform="translate(13.5 3.5) scale(0.65)">
				<path d={MAPLE_LEAF} fill="#E1343F" />
			</g>
		</svg>
	);
};

/** Vignette photo arrondie, avec un lent zoom. */
export const PhotoThumb: React.FC<{src: string; delay: number}> = ({src, delay}) => {
	const frame = useCurrentFrame();
	const p = useSpring(delay + 6, 26);
	const zoom = 1.12 - 0.08 * Math.min(1, Math.max(0, (frame - delay) / 150));
	return (
		<div
			style={{
				width: 180,
				height: 240,
				borderRadius: 24,
				overflow: 'hidden',
				flexShrink: 0,
				alignSelf: 'center',
				border: `4px solid ${COLORS.night}`,
				boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
				opacity: p,
				transform: `scale(${0.85 + 0.15 * p})`,
			}}
		>
			<Img
				src={staticFile(src)}
				style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`}}
			/>
		</div>
	);
};

/** Carte arrondie bleue avec drapeau, nom du pays et vignette photo facultative. */
export const CountryCard: React.FC<{
	country: 'france' | 'canada';
	style?: React.CSSProperties;
	children?: React.ReactNode;
	photo?: React.ReactNode;
}> = ({country, style, children, photo}) => (
	<div
		style={{
			backgroundColor: COLORS.blue,
			borderRadius: 32,
			padding: photo ? '28px 28px 28px 40px' : '32px 40px 36px',
			boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
			display: 'flex',
			alignItems: 'center',
			gap: 28,
			...style,
		}}
	>
		<div style={{flex: 1, minWidth: 0}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
				<Flag country={country} height={40} />
				<div style={{...TYPE.text, color: COLORS.lightBlue}}>
					{country === 'france' ? 'France' : 'Canada'}
				</div>
			</div>
			{children ? <div style={{marginTop: 16}}>{children}</div> : null}
		</div>
		{photo}
	</div>
);

export const Title: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({
	children,
	style,
}) => <div style={{...TYPE.title, color: COLORS.white, ...style}}>{children}</div>;
