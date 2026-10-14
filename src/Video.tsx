import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {LAYOUTS, Format, SCENES} from './constants';
import {Background, fontFamily, LayoutContext, Logo, SceneFade} from './components/common';
import {Scene1Hook} from './scenes/Scene1Hook';
import {Scene2Promise} from './scenes/Scene2Promise';
import {Scene3Budget} from './scenes/Scene3Budget';
import {Scene4AfterDegree} from './scenes/Scene4AfterDegree';
import {Scene5Language} from './scenes/Scene5Language';
import {Scene6Deadline} from './scenes/Scene6Deadline';
import {Scene7Summary} from './scenes/Scene7Summary';
import {Scene8Cta} from './scenes/Scene8Cta';

const ORDER: Array<[keyof typeof SCENES, React.FC]> = [
	['hook', Scene1Hook],
	['promise', Scene2Promise],
	['budget', Scene3Budget],
	['afterDegree', Scene4AfterDegree],
	['language', Scene5Language],
	['deadline', Scene6Deadline],
	['summary', Scene7Summary],
	['cta', Scene8Cta],
];

export const FranceOuCanada: React.FC<{format: Format}> = ({format}) => (
	<LayoutContext.Provider value={LAYOUTS[format]}>
		<AbsoluteFill style={{fontFamily}}>
			<Background />
			{ORDER.map(([key, Scene], i) => {
				const {from, duration} = SCENES[key];
				return (
					<Sequence key={key} from={from} durationInFrames={duration} name={key}>
						<SceneFade duration={duration} fadeOut={i < ORDER.length - 1}>
							<Scene />
						</SceneFade>
					</Sequence>
				);
			})}
			<Logo />
		</AbsoluteFill>
	</LayoutContext.Provider>
);
