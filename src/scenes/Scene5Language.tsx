import React from 'react';
import {BEATS, NB} from '../constants';
import {Compare} from '../components/Compare';

export const Scene5Language: React.FC = () => (
	<Compare
		francePhoto="photos/amphitheatre.jpg"
		canadaPhoto="photos/hublot.jpg"
		beats={BEATS.language}
		title={`3.${NB}Dans quelle langue${NB}?`}
		france="Tout en français"
		canada="Surtout en anglais, sauf au Québec et dans les établissements francophones"
	/>
);
