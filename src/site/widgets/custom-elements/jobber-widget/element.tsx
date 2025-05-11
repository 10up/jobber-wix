import React, { useEffect, type FC, useRef } from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from 'react-to-webcomponent';
import styles from './element.module.css';
import { type EmbedObject } from '../../../../hooks/useFetchJobberForms';

interface Props {
	formType?: 'request' | 'booking';
	embedScript?: EmbedObject;
}

const CustomElement: FC<Props> = ({
	formType = 'request',
	embedScript = { markup: '', styles: [], scripts: [] },
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!embedScript.markup || !container) return undefined;

		// Get the shadow root from the container
		const shadowRoot = container.getRootNode() as ShadowRoot;
		if (!shadowRoot) return undefined;

		// Add styles
		embedScript.styles.forEach((styleContent) => {
			const style = shadowRoot.ownerDocument.createElement('style');
			style.textContent = styleContent;
			shadowRoot.appendChild(style);
		});

		// Add markup
		const markupContainer = shadowRoot.ownerDocument.createElement('div');
		markupContainer.setAttribute('data-jobber-form-type', formType);
		markupContainer.innerHTML = embedScript.markup;
		shadowRoot.appendChild(markupContainer);

		// Add scripts
		embedScript.scripts.forEach((scriptContent) => {
			// Wrap the script to provide shadow DOM context by patching the document object
			const s = `
				(function() {
					var shadowRoot = document.querySelector('jobber-widget').shadowRoot;
					shadowRoot.currentScript = shadowRoot.querySelector('script');
					shadowRoot.createElement = function(...args) {
						return shadowRoot.ownerDocument.createElement(...args);
					};
					${scriptContent.content.replaceAll('document.', 'shadowRoot.')}
				})();
			`;

			const blob = new Blob([s], { type: 'text/javascript' });
			const scriptUrl = URL.createObjectURL(blob);
			const script = shadowRoot.ownerDocument.createElement('script');
			script.src = scriptUrl;

			Object.entries(scriptContent.attributes).forEach(([key, value]) => {
				if (key !== 'src') {
					script.setAttribute(key, value);
				}
			});

			markupContainer.appendChild(script);

			// Clean up the blob URL after script loads
			script.onload = () => URL.revokeObjectURL(scriptUrl);
		});

		// Cleanup function
		return () => {
			if (container) {
				container.innerHTML = '';
			}
		};
	}, [embedScript, formType]);

	if (!embedScript.markup) {
		return (
			<div className={styles.root}>Please configure a form type in the widget settings</div>
		);
	}

	return <div ref={containerRef} className={styles.root} />;
};

const customElement = reactToWebComponent(CustomElement, React, ReactDOM as any, {
	props: {
		formType: 'string',
		embedScript: 'json',
	},
	shadow: 'open',
});

export default customElement;
