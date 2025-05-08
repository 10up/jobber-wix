import React, { type FC, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from 'react-to-webcomponent';
import styles from './element.module.css';

interface Props {
	formType?: 'request' | 'booking';
	embedScript?: string;
}

const CustomElement: FC<Props> = ({ formType = 'request', embedScript = '' }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const shadowRootRef = useRef<ShadowRoot | null>(null);

	useEffect(() => {
		if (!embedScript || !containerRef.current) return undefined;

		// Create shadow root if it doesn't exist
		if (!shadowRootRef.current) {
			shadowRootRef.current = containerRef.current.attachShadow({ mode: 'open' });
		}

		const shadowRoot = shadowRootRef.current;
		const container = document.createElement('div');
		shadowRoot.appendChild(container);

		// Create a temporary container to parse the HTML
		const tempContainer = document.createElement('div');
		tempContainer.innerHTML = embedScript;

		// Handle CSS links
		const styleLinks = tempContainer.getElementsByTagName('link');
		Array.from(styleLinks).forEach((link) => {
			if (link.rel === 'stylesheet') {
				const newLink = document.createElement('link');
				newLink.rel = 'stylesheet';
				newLink.href = link.href;
				shadowRoot.appendChild(newLink);
			}
		});

		// Handle scripts
		const scripts = tempContainer.getElementsByTagName('script');
		Array.from(scripts).forEach((script) => {
			const newScript = document.createElement('script');
			if (script.src) {
				newScript.src = script.src;
			} else {
				newScript.textContent = script.textContent || '';
			}
			shadowRoot.appendChild(newScript);
		});

		// Handle other HTML content
		const otherContent = Array.from(tempContainer.childNodes).filter(
			(node) =>
				node.nodeType !== Node.ELEMENT_NODE ||
				(node.nodeType === Node.ELEMENT_NODE &&
					!['SCRIPT', 'LINK'].includes((node as Element).tagName)),
		);

		otherContent.forEach((node) => {
			container.appendChild(node.cloneNode(true));
		});

		// Cleanup function
		return () => {
			if (shadowRoot) {
				shadowRoot.innerHTML = '';
			}
		};
	}, [embedScript]);

	return (
		<div className={styles.root}>
			<h2>{formType}</h2>
			<hr />
			<div ref={containerRef} />
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
