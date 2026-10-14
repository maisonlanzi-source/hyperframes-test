import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {BEATS, COLORS, NB, SCENES} from '../constants';
import {driftTime, TYPE, useEnter, useLayout, useSpring} from '../components/common';

const B = BEATS.cta;

const ITEMS = [
	'La procédure, étape par étape',
	'La preuve de fonds',
	'La lettre de motivation',
	"L'entretien Campus France",
];

const PAGES = [
	'ebook-page-france-ou-canada.png',
	'ebook-page-budget.png',
	'ebook-page-calendrier.png',
	'ebook-couverture.png',
];

const CheckLine: React.FC<{text: string; delay: number}> = ({text, delay}) => {
	const enter = useEnter(delay, 'left');
	const check = useSpring(delay + 4, 12);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 28, ...enter}}>
			<svg width={64} height={64} viewBox="0 0 64 64" style={{flexShrink: 0}}>
				<circle cx={32} cy={32} r={30} fill={COLORS.yellow} opacity={0.25 + 0.75 * check} />
				<path
					d="M 18 33 L 28 43 L 46 23"
					fill="none"
					stroke={COLORS.night}
					strokeWidth={7}
					strokeLinecap="round"
					strokeLinejoin="round"
					pathLength={1}
					strokeDasharray={1}
					strokeDashoffset={1 - check}
				/>
			</svg>
			<div style={{...TYPE.text, fontSize: 52, color: COLORS.white}}>{text}</div>
		</div>
	);
};

/** Pages intérieures qui défilent lentement derrière la maquette. */
const PagesStrip: React.FC<{size: number; clipWidth: number}> = ({size, clipWidth}) => {
	const frame = useCurrentFrame();
	const appear = useSpring(B.mockup, 30);
	const t = driftTime(frame + SCENES.cta.from) - SCENES.cta.from;
	const pageW = size * 0.5;
	const pageH = pageW * 1.414;
	const step = pageW + 26;
	const offset = (t - B.mockup) * 1.1;
	return (
		<div
			style={{
				position: 'absolute',
				top: -60,
				bottom: -60,
				left: (size - clipWidth) / 2,
				width: clipWidth,
				overflow: 'hidden',
			}}
		>
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top: '50%',
				width: step * 6,
				height: pageH,
				transform: `translate(-50%, -50%) rotate(-8deg)`,
				opacity: appear * 0.22,
			}}
		>
			{[...PAGES, ...PAGES].map((p, i) => (
				<Img
					key={i}
					src={staticFile(p)}
					style={{
						position: 'absolute',
						left: i * step - offset,
						top: 0,
						width: pageW,
						height: pageH,
						borderRadius: 10,
						filter: 'blur(1.5px)',
					}}
				/>
			))}
		</div>
		</div>
	);
};

export const Scene8Cta: React.FC = () => {
	const frame = useCurrentFrame();
	const l = useLayout();
	const is916 = l.height > 1500;

	const intro = useEnter(B.intro);
	const listOut = interpolate(frame, [B.listOut, B.listOut + B.listOutDuration], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const mock = useSpring(B.mockup, 30);
	const title = useEnter(B.title);
	const subtitle = useEnter(B.subtitle);
	const button = useSpring(B.button, 24);
	const last = useEnter(B.lastLine);

	const t = driftTime(frame + SCENES.cta.from) - SCENES.cta.from;
	// Léger flottement, qui s'arrête avec le temps « lent » (image finale fixe).
	const float = Math.sin(t * 0.09) * 10;
	const mockSize = is916 ? 470 : 430;
	const top = l.safeTop;
	const width = l.width - 2 * l.side;

	return (
		<>
			{listOut > 0 ? (
				<div
					style={{
						position: 'absolute',
						left: l.side,
						top: l.contentTop,
						width,
						height: l.safeBottom - l.contentTop,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						gap: 40,
						opacity: listOut,
						transform: `translateY(${(1 - listOut) * -40}px)`,
					}}
				>
					<div style={{...TYPE.title, color: COLORS.white, marginBottom: 16, ...intro}}>
						Ce n'est que le début.
					</div>
					{ITEMS.map((it, i) => (
						<CheckLine key={it} text={it} delay={B.checksStart + i * B.checkStep} />
					))}
				</div>
			) : null}

			{frame >= B.mockup ? (
				<div
					style={{
						position: 'absolute',
						left: l.side,
						top,
						width,
						height: l.safeBottom - top,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 26,
						textAlign: 'center',
					}}
				>
					<div
						style={{
							position: 'relative',
							width: mockSize,
							height: mockSize,
							flexShrink: 0,
							marginBottom: 6,
						}}
					>
						<PagesStrip size={mockSize} clipWidth={width} />
						<Img
							src={staticFile('ebook-maquette-3d.png')}
							style={{
								position: 'relative',
								width: mockSize,
								height: mockSize,
								objectFit: 'contain',
								opacity: mock,
								transform: `translateX(${(1 - mock) * 420}px) translateY(${float * mock}px) rotate(${(1 - mock) * 8}deg)`,
								filter: 'drop-shadow(0 24px 30px rgba(0,0,0,0.35))',
							}}
						/>
					</div>
					<div style={{...TYPE.title, color: COLORS.white, ...title}}>{`Le guide complet Cap${NB}Études`}</div>
					<div style={{...TYPE.text, color: COLORS.lightBlue, ...subtitle}}>
						{`43${NB}pages · Budget en FCFA · 8${NB}modèles prêts à remplir`}
					</div>
					<div
						style={{
							...TYPE.text,
							fontWeight: 800,
							fontSize: 52,
							color: COLORS.night,
							backgroundColor: COLORS.yellow,
							borderRadius: 999,
							padding: '26px 56px',
							marginTop: 8,
							boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
							opacity: button,
							transform: `scale(${0.85 + 0.15 * button})`,
							whiteSpace: 'nowrap',
						}}
					>
						{`Guide PDF · 9${NB}900${NB}FCFA`}
					</div>
					<div style={{...TYPE.note, color: COLORS.white, ...last}}>
						Appuyez sur le bouton sous la vidéo
					</div>
				</div>
			) : null}
		</>
	);
};
