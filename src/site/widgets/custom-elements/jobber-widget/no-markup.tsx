import React from 'react';
import jobberIcon from '../../../../assets/jobber-widget/jobber-icon.png';

const NoMarkup: React.FC = () => (
	<div
		style={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			minHeight: '200px',
			width: '100%',
			height: '100%',
			padding: '1rem',
			boxSizing: 'border-box',
			backgroundColor: 'white',
		}}
	>
		<img
			src={jobberIcon}
			alt="Jobber Logo"
			style={{
				width: '80px',
				height: 'auto',
				marginBottom: '1rem',
			}}
		/>
		<p
			style={{
				fontSize: '1.25rem',
				fontWeight: 500,
				margin: 0,
				color: '#444',
				textAlign: 'center',
			}}
		>
			To embed a Jobber form, open settings and select which form you want to embed.
		</p>
	</div>
);

export default NoMarkup;
