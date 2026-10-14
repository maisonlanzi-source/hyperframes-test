import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {BEATS, COLORS, NB} from '../constants';
import {Compare} from '../components/Compare';
import {useSpring} from '../components/common';

const B = BEATS.deadline;

const Grid: React.FC<{highlight?: boolean}> = ({highlight}) => (
	<div
		style={{
			display: 'grid',
			gridTemplateColumns: 'repeat(4, 1fr)',
			gap: 8,
			padding: '14px 14px',
		}}
	>
		{Array.from({length: 12}).map((_, i) => (
			<div
				key={i}
				style={{
					height: 16,
					borderRadius: 4,
					backgroundColor: highlight && i === 6 ? COLORS.yellow : '#C9D6EE',
				}}
			/>
		))}
	</div>
);

/** Petite page de calendrier dont la feuille du dessus se tourne. */
const Calendar: React.FC = () => {
	const flip = useSpring(B.pageFlip, B.pageFlipDuration);
	const angle = interpolate(flip, [0, 1], [0, -180]);
	const page: React.CSSProperties = {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 34,
		bottom: 0,
		backgroundColor: COLORS.white,
		borderRadius: '0 0 18px 18px',
	};
	return (
		<div style={{position: 'relative', width: 150, height: 160, flexShrink: 0, perspective: 600}}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: 18,
					backgroundColor: COLORS.white,
					boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
				}}
			/>
			<div style={page}>
				<Grid highlight={flip > 0.5} />
			</div>
			<div
				style={{
					...page,
					transformOrigin: 'top center',
					transform: `rotateX(${angle}deg)`,
					backfaceVisibility: 'hidden',
					opacity: angle < -90 ? 0 : 1,
					boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
				}}
			>
				<Grid />
			</div>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 0,
					height: 40,
					backgroundColor: COLORS.yellow,
					borderRadius: '18px 18px 0 0',
				}}
			/>
			{[38, 98].map((x) => (
				<div
					key={x}
					style={{
						position: 'absolute',
						left: x,
						top: -10,
						width: 14,
						height: 28,
						borderRadius: 7,
						backgroundColor: COLORS.night,
					}}
				/>
			))}
		</div>
	);
};

/** Date entourée d'un trait jaune qui se dessine. */
const CircledDate: React.FC<{children: string}> = ({children}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [B.circle, B.circle + B.circleDuration], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: (t) => 1 - Math.pow(1 - t, 3),
	});
	return (
		<span style={{position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', color: COLORS.yellow}}>
			{children}
			<svg
				style={{
					position: 'absolute',
					left: -46,
					top: -14,
					width: 'calc(100% + 92px)',
					height: 'calc(100% + 28px)',
					overflow: 'visible',
					transform: 'rotate(-2deg)',
				}}
			>
				<ellipse
					cx="50%"
					cy="50%"
					rx="49%"
					ry="46%"
					fill="none"
					stroke={COLORS.yellow}
					strokeWidth={5}
					strokeLinecap="round"
					pathLength={1}
					strokeDasharray={1}
					strokeDashoffset={1 - p}
				/>
			</svg>
		</span>
	);
};

export const Scene6Deadline: React.FC = () => (
	<Compare
		beats={BEATS.deadline}
		title={`4.${NB}Quand déposer le dossier${NB}?`}
		franceAside={<Calendar />}
		france={
			<>
				<div>{`Licence${NB}1${NB}: avant le`}</div>
				<div style={{marginTop: 22, marginLeft: 46}}>
					<CircledDate>{`15${NB}décembre${NB}2026`}</CircledDate>
				</div>
			</>
		}
		canada={`Selon l'établissement, souvent entre janvier et mars${NB}2027`}
	/>
);
