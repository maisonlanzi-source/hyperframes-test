import React from 'react';
import {BEATS, COLORS, NB} from '../constants';
import {ContentBox, TYPE, useEnter} from '../components/common';

const B = BEATS.promise;

export const Scene2Promise: React.FC = () => {
	const line1 = useEnter(B.text);
	const line2 = useEnter(B.text + 8);
	return (
		<ContentBox>
			<div style={{...TYPE.title, fontSize: 100, color: COLORS.white, textAlign: 'center'}}>
				<div style={line1}>Voici comment choisir,</div>
				<div style={line2}>
					en <span style={{color: COLORS.yellow}}>{`4${NB}questions`}</span>.
				</div>
			</div>
		</ContentBox>
	);
};
