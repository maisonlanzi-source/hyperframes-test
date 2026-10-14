import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {BEATS, COLORS, NB} from '../constants';
import {ContentBox, Title, TYPE, useEnter} from '../components/common';

const B = BEATS.summary;

/** Flèche vers le bas qui se dessine. */
const Arrow: React.FC<{delay: number}> = ({delay}) => {
	const frame = useCurrentFrame();
	const p = interpolate(frame, [delay, delay + B.arrowDuration], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: (t) => 1 - Math.pow(1 - t, 2),
	});
	const head = interpolate(p, [0.7, 1], [0, 1], {extrapolateLeft: 'clamp'});
	return (
		<svg width={60} height={64} viewBox="0 0 60 64" style={{display: 'block', marginLeft: 20}}>
			<path
				d="M 30 4 L 30 56"
				stroke={COLORS.yellow}
				strokeWidth={7}
				strokeLinecap="round"
				pathLength={1}
				strokeDasharray={1}
				strokeDashoffset={1 - p}
			/>
			<path
				d="M 12 40 L 30 58 L 48 40"
				stroke={COLORS.yellow}
				strokeWidth={7}
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
				opacity={head}
			/>
		</svg>
	);
};

const Row: React.FC<{
	condition: string;
	conclusion: string;
	beats: {line: number; arrow: number; conclusion: number};
}> = ({condition, conclusion, beats}) => {
	const line = useEnter(beats.line);
	const concl = useEnter(beats.conclusion, 'left');
	return (
		<div>
			<div
				style={{
					...TYPE.text,
					color: COLORS.white,
					backgroundColor: COLORS.blue,
					borderRadius: 28,
					padding: '26px 36px',
					...line,
				}}
			>
				{condition}
			</div>
			<div style={{display: 'flex', alignItems: 'center', gap: 20, marginTop: 10}}>
				<Arrow delay={beats.arrow} />
				<div style={{...TYPE.text, fontWeight: 800, fontSize: 60, color: COLORS.yellow, ...concl}}>
					{conclusion}
				</div>
			</div>
		</div>
	);
};

export const Scene7Summary: React.FC = () => {
	const title = useEnter(B.title);
	return (
		<ContentBox gap={44}>
			<Title style={title}>En résumé</Title>
			<Row
				condition={`Budget sous 8${NB}M${NB}FCFA par an`}
				conclusion="Visez la France"
				beats={{line: B.line1, arrow: B.arrow1, conclusion: B.conclusion1}}
			/>
			<Row
				condition={`Au moins 16${NB}M${NB}FCFA la 1re${NB}année et un projet d'installation`}
				conclusion="Le Canada se justifie"
				beats={{line: B.line2, arrow: B.arrow2, conclusion: B.conclusion2}}
			/>
		</ContentBox>
	);
};
