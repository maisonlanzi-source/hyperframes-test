import React from 'react';
import {COLORS} from '../constants';
import {ContentBox, CountryCard, PhotoThumb, Title, TYPE, useEnter} from './common';

/** Titre de question + deux cartes France / Canada l'une sous l'autre. */
export const Compare: React.FC<{
	title: string;
	france: React.ReactNode;
	canada: React.ReactNode;
	beats: {title: number; france: number; canada: number};
	franceAside?: React.ReactNode;
	/** Vignettes photo (chemins dans public/). */
	francePhoto?: string;
	canadaPhoto?: string;
}> = ({title, france, canada, beats, franceAside, francePhoto, canadaPhoto}) => {
	const t = useEnter(beats.title);
	const f = useEnter(beats.france, 'left');
	const c = useEnter(beats.canada, 'right');
	const body = {...TYPE.text, color: COLORS.white};
	return (
		<ContentBox gap={44}>
			<Title style={t}>{title}</Title>
			<div style={{display: 'flex', flexDirection: 'column', gap: 32}}>
				<CountryCard
					country="france"
					style={f}
					photo={francePhoto ? <PhotoThumb src={francePhoto} delay={beats.france} /> : undefined}
				>
					<div style={{display: 'flex', alignItems: 'center', gap: 32}}>
						{franceAside}
						<div style={{...body, flex: 1}}>{france}</div>
					</div>
				</CountryCard>
				<CountryCard
					country="canada"
					style={c}
					photo={canadaPhoto ? <PhotoThumb src={canadaPhoto} delay={beats.canada} /> : undefined}
				>
					<div style={body}>{canada}</div>
				</CountryCard>
			</div>
		</ContentBox>
	);
};
