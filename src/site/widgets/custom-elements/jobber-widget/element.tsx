import React, { useEffect, type FC, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import reactToWebComponent from 'react-to-webcomponent';
import { window as w } from '@wix/site-window';
import useDeepCompareEffect from 'use-deep-compare-effect';
import styles from './element.module.css';
import { type EmbedObject } from '../../../../hooks/useFetchJobberForms';
import NoMarkup from './no-markup';

const HEIGHT_MESSAGE = /^\d+(\.\d+)?px$/;
const frameHeights = new Map<HTMLIFrameElement, string>();
let resizeHandlerInstalled = false;

/**
 * Resize each widget's form to its own height.
 *
 * Jobber's embed script resizes its form on every height message, whichever form sent
 * it, so with several widgets on one page they all end up at the last reported height.
 * One shared handler matches each message to the iframe that sent it, and stops Jobber's
 * handlers from applying it to the other widgets. It is registered on first mount, so it
 * runs before Jobber's handlers, which are only added once each form has loaded.
 */
const installResizeHandler = () => {
	if (resizeHandlerInstalled) return;
	resizeHandlerInstalled = true;

	window.addEventListener('message', (e: MessageEvent) => {
		if (typeof e.data !== 'string' || !HEIGHT_MESSAGE.test(e.data)) return;

		const frames = Array.from(document.querySelectorAll('jobber-widget')).flatMap((widget) =>
			Array.from(
				widget.shadowRoot?.querySelectorAll<HTMLIFrameElement>(
					'iframe.jobber-work-request',
				) ?? [],
			),
		);
		const source = frames.find((frame) => frame.contentWindow === e.source);

		if (!source) return;

		frameHeights.set(source, e.data);

		frameHeights.forEach((height, frame) => {
			if (!frame.isConnected) {
				frameHeights.delete(frame);
				return;
			}
			frame.style.height = height;
			if (frame.parentElement) frame.parentElement.style.height = height;
		});

		e.stopImmediatePropagation();
	});
};

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

	useEffect(() => {
		installResizeHandler();
	}, []);

	useEffect(() => {
		const handleMessage = (e: MessageEvent) => {
			if (e.data === 'scrolltop') {
				const shadowRoot = containerRef.current?.getRootNode() as ShadowRoot;
				const host = shadowRoot?.host;
				if (!host) return;
				requestAnimationFrame(() => {
					const rect = host.getBoundingClientRect();
					w.scrollBy(0, rect.top).catch(() => {
						host.scrollIntoView({ behavior: 'smooth', block: 'start' });
					});
				});
			}
		};
		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	}, []);

	useDeepCompareEffect(() => {
		const container = containerRef.current;

		if (!container) return undefined;

		container.innerHTML = '';

		if (!embedScript.markup || !id) return undefined;

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
					var shadowRoot = document.querySelector('jobber-widget[id="${id}"]').shadowRoot;
					shadowRoot.currentScript = shadowRoot.querySelector('script');
					shadowRoot.createElement = function(...args) {
						return shadowRoot.ownerDocument.createElement(...args);
					};
					${scriptContent.content
						.replaceAll('document.', 'shadowRoot.')
						.replaceAll('.scrollTo(', '?.scrollTo?.(')}
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
		if (viewMode === 'Site' || viewMode === 'Preview') {
			return null;
		}
		return <NoMarkup />;
	}

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
