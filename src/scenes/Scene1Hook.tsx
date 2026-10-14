import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {BEATS, COLORS, NB} from '../constants';
import {ContentBox, Flag, TYPE, useEnter, useSpring} from '../components/common';

const B = BEATS.hook;
const QUESTION = `Votre enfant passe son bac cette année${NB}?`;

const Word: React.FC<{word: string; index: number}> = ({word, index}) => {
	// Le premier mot est déjà là à la toute première image.
	const delay = index === 0 ? -30 : B.wordsStart + index * B.wordStep;
	const style = useEnter(delay);
	return <span style={{display: 'inline-block', marginRight: '0.26em', ...style}}>{word}</span>;
};

const SideCard: React.FC<{country: 'france' | 'canada'}> = ({country}) => {
	const p = useSpring(B.cards, 26);
	const dir = country === 'france' ? -1 : 1;
	return (
		<div
			style={{
				flex: 1,
				height: 220,
				backgroundColor: COLORS.blue,
				borderRadius: 36,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 20,
				boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
				opacity: p,
				transform: `translateX(${dir * (1 - p) * 320}px)`,
			}}
		>
			<Flag country={country} height={56} />
			<div style={{...TYPE.text, fontWeight: 800, fontSize: 56, color: COLORS.white}}>
				{country === 'france' ? 'France' : 'Canada'}
			</div>
		</div>
	);
};

export const Scene1Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const big = useEnter(B.bigQuestion);
	const qIn = useSpring(B.questionMark, 20);
	const pulse = 1 + 0.12 * Math.max(0, Math.sin((frame - B.questionMark) * 0.22));
	const words = QUESTION.split(' ');

	return (
		<ContentBox withLogo={false} gap={56}>
			<div style={{...TYPE.title, color: COLORS.white, textAlign: 'center'}}>
				{words.map((w, i) => (
					<Word key={i} word={w} index={i} />
				))}
			</div>
			<div
				style={{
					...TYPE.title,
					fontSize: 116,
					color: COLORS.yellow,
					textAlign: 'center',
					...big,
				}}
			>
				{`France ou Canada${NB}?`}
			</div>
			<div style={{display: 'flex', alignItems: 'center', gap: 24, marginTop: 8}}>
				<SideCard country="france" />
				<div
					style={{
						width: 110,
						height: 110,
						borderRadius: '50%',
						backgroundColor: COLORS.yellow,
						color: COLORS.night,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						...TYPE.title,
						fontSize: 80,
						flexShrink: 0,
						opacity: qIn,
						transform: `scale(${interpolate(qIn, [0, 1], [0.4, 1]) * (frame > B.questionMark ? pulse : 1)})`,
					}}
				>
					?
				</div>
				<SideCard country="canada" />
			</div>
		</ContentBox>
	);
};
