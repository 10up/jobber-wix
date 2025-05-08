import React, { type FC } from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from 'react-to-webcomponent';
import styles from './element.module.css';

interface Props {
	formType?: 'request' | 'booking';
	embedScript?: string;
}

const CustomElement: FC<Props> = ({ formType = 'request', embedScript = '' }) => {
	return (
		<iframe
			className={styles.root}
			srcDoc={embedScript}
			title={`Jobber ${formType} form`}
			width="100%"
			height="100%"
			style={{
				border: 'none',
				overflow: 'hidden',
			}}
		/>
	);
};

const customElement = reactToWebComponent(CustomElement, React, ReactDOM as any, {
	props: {
		formType: 'string',
		embedScript: 'string',
	},
	shadow: 'open',
});

export default customElement;
