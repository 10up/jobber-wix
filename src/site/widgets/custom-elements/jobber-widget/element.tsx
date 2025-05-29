import React, { useEffect, type FC, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from 'react-to-webcomponent';
import { window as w } from '@wix/site-window';
import useDeepCompareEffect from 'use-deep-compare-effect';
import styles from './element.module.css';
import { type EmbedObject } from '../../../../hooks/useFetchJobberForms';
import NoMarkup from './no-markup';

interface Props {
	formType?: 'request' | 'booking';
	embedScript?: EmbedObject;
	id?: string;
}

const CustomElement: FC<Props> = ({
	formType = 'request',
	embedScript = { markup: '', scripts: [] },
	id = undefined,
}) => {
	const [viewMode, setViewMode] = useState<'Preview' | 'Site' | 'Editor'>('Site');

	useEffect(() => {
		w.viewMode()
			.then((mode) => {
				setViewMode(mode as 'Preview' | 'Site' | 'Editor');
			})
			.catch((error) => {
				console.error('Error getting view mode:', error);
			});
	}, []);

	const containerRef = useRef<HTMLDivElement>(null);

	useDeepCompareEffect(() => {
		const container = containerRef.current;

		if (!container) return undefined;

		container.innerHTML = '';

		if (!embedScript.markup || !id) return undefined;

		console.log('useEffect', id, formType, embedScript);
		// Get the shadow root from the container
		const shadowRoot = container.getRootNode() as ShadowRoot;
		if (!shadowRoot) return undefined;

		// Add markup
		const markupContainer = shadowRoot.ownerDocument.createElement('div');
		markupContainer.innerHTML = embedScript.markup;
		container.appendChild(markupContainer);

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
	}, [embedScript, formType, id]);

	if (!embedScript.markup || !id) {
		console.log('no markup or id', embedScript.markup, id);
		if (viewMode === 'Site' || viewMode === 'Preview') {
			return null;
		}
		return <NoMarkup />;
	}

	console.log('rendering', id, formType, embedScript);
	return <div ref={containerRef} className={styles.root} />;
};

const customElement = reactToWebComponent(CustomElement, React, ReactDOM as any, {
	props: {
		embedScript: 'json',
		formType: 'string',
		id: 'string',
	},
	shadow: 'open',
});

export default customElement;
