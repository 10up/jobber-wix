import React, { type FC } from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from 'react-to-webcomponent';
import styles from './element.module.css';

interface Props {
	formType?: 'request' | 'booking';
	embedScript?: string;
}

const CustomElement: FC<Props> = ({ formType = 'request', embedScript = '' }) => {
	console.log('embedScript', embedScript);
	return (
		<div className={styles.root}>
			<h2>{formType}</h2>
			<hr />
			{embedScript && <div dangerouslySetInnerHTML={{ __html: embedScript }} />}
		</div>
	);
};

const customElement = reactToWebComponent(CustomElement, React, ReactDOM as any, {
	props: {
		formType: 'string',
		embedScript: 'string',
	},
});

export default customElement;
