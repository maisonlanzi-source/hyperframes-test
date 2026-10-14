import React from 'react';
import {interpolate} from 'remotion';
import {BEATS, COLORS, NB} from '../constants';
import {ContentBox, Flag, Title, TYPE, useEnter, useSpring} from '../components/common';

const B = BEATS.budget;
const SCALE_MAX = 24; // M FCFA, même échelle pour les deux barres

const BudgetBar: React.FC<{
	country: 'france' | 'canada';
	low: number;
	high: number;
	delay: number;
}> = ({country, low, high, delay}) => {
	const enter = useEnter(delay - 10);
	const p = useSpring(delay, B.barDuration);
	const fill = p * high;
	const solid = Math.min(fill, low);
	const light = Math.max(0, fill - low);
	const lowShown = Math.round(interpolate(p, [0, 1], [0, low]));
	const highShown = Math.round(interpolate(p, [0, 1], [0, high]));
	const pct = (v: number) => `${(v / SCALE_MAX) * 100}%`;
	return (
		<div style={enter}>
			<div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18}}>
				<Flag country={country} height={40} />
				<div style={{...TYPE.text, color: COLORS.white, flex: 1}}>
					{country === 'france' ? 'France' : 'Canada'}
				</div>
				<div
					style={{
						...TYPE.text,
						fontWeight: 800,
						fontSize: 56,
						color: COLORS.yellow,
						fontVariantNumeric: 'tabular-nums',
						whiteSpace: 'nowrap',
					}}
				>
					{`${lowShown}${NB}à${NB}${highShown}${NB}M${NB}FCFA`}
				</div>
			</div>
			<div
				style={{
					position: 'relative',
					height: 72,
					borderRadius: 36,
					backgroundColor: 'rgba(15, 76, 181, 0.9)',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						bottom: 0,
						width: pct(solid),
						backgroundColor: COLORS.yellow,
					}}
				/>
				<div
					style={{
						position: 'absolute',
						left: pct(solid),
						top: 0,
						bottom: 0,
						width: pct(light),
						backgroundColor: COLORS.yellowLight,
						borderRadius: '0 36px 36px 0',
					}}
				/>
			</div>
		</div>
	);
};

export const Scene3Budget: React.FC = () => {
	const title = useEnter(B.title);
	const conclusion = useEnter(B.conclusion);
	const note = useEnter(B.note);
	return (
		<ContentBox gap={52}>
			<Title style={title}>{`1.${NB}Quel budget pouvez-vous réunir${NB}?`}</Title>
			<div style={{display: 'flex', flexDirection: 'column', gap: 40}}>
				<BudgetBar country="france" low={6} high={8} delay={B.franceBar} />
				<BudgetBar country="canada" low={16} high={24} delay={B.canadaBar} />
			</div>
			<div style={{...TYPE.text, fontSize: 56, fontWeight: 800, color: COLORS.white, ...conclusion}}>
				Le Canada coûte <span style={{color: COLORS.yellow}}>{`2${NB}à${NB}3${NB}fois`}</span>{` plus${NB}cher.`}
			</div>
			<div style={{...TYPE.note, color: COLORS.lightBlue, ...note}}>
				Première année, scolarité et vie courante. Montants arrondis, tarifs{' '}
				<span style={{whiteSpace: 'nowrap'}}>2026-2027</span>.
			</div>
		</ContentBox>
	);
};
