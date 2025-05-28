import React from 'react';

const NoMarkup: React.FC = () => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			minHeight: '200px',
			width: '100%',
			height: '100%',
			padding: '1rem',
			boxSizing: 'border-box',
		}}
	>
		<p
			style={{
				fontSize: '1.25rem',
				fontWeight: 500,
				margin: 0,
				color: '#444',
				textAlign: 'center',
			}}
		>
			To embed a jobber form, open settings and select which form you want to embed.
		</p>
	</div>
);

export default NoMarkup;
