import React, { type FC } from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from 'react-to-webcomponent';
import styles from './element.module.css';

interface Props {
	formType?: 'request' | 'booking';
}

const CustomElement: FC<Props> = ({ formType = 'request' }) => {
	return (
		<div className={styles.root}>
			<h2>{formType}</h2>
			<hr />
		</div>
	);
};

const customElement = reactToWebComponent(CustomElement, React, ReactDOM as any, {
	props: {
		formType: 'string',
	},
});

export default customElement;
