import React from 'react';
import {Composition} from 'remotion';
import {FPS, LAYOUTS, TOTAL_DURATION} from './constants';
import {FranceOuCanada} from './Video';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="FranceOuCanada-9x16"
			component={FranceOuCanada}
			durationInFrames={TOTAL_DURATION}
			fps={FPS}
			width={LAYOUTS['9x16'].width}
			height={LAYOUTS['9x16'].height}
			defaultProps={{format: '9x16' as const}}
		/>
		<Composition
			id="FranceOuCanada-4x5"
			component={FranceOuCanada}
			durationInFrames={TOTAL_DURATION}
			fps={FPS}
			width={LAYOUTS['4x5'].width}
			height={LAYOUTS['4x5'].height}
			defaultProps={{format: '4x5' as const}}
		/>
	</>
);
