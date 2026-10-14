import React from 'react';
import {BEATS, NB} from '../constants';
import {Compare} from '../components/Compare';

export const Scene4AfterDegree: React.FC = () => (
	<Compare
		beats={BEATS.afterDegree}
		title={`2.${NB}Et après le diplôme${NB}?`}
		france="Un titre de séjour pour chercher un emploi, selon le diplôme"
		canada="Un permis de travail, puis une voie vers la résidence permanente"
	/>
);
