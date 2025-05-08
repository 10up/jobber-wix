import { useEffect, useState } from 'react';
import { createClient } from '@wix/sdk';
import { editor, widget } from '@wix/editor';
import { getMiddlewareUrl } from '../utils/api';
import { getInstance } from '../backend/get-instance.web';

type FormType = 'request' | 'booking';

interface UseFetchJobberFormsProps {
	formType: FormType;
	onSuccess: (data: any) => void;
	shouldFetch?: () => boolean;
}

export function useFetchJobberForms({
	formType,
	onSuccess,
	shouldFetch = () => true,
}: UseFetchJobberFormsProps) {
	const [embedScript, setEmbedScript] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!shouldFetch()) {
			return;
		}

		const abortController = new AbortController();
		setIsLoading(true);
		setError(null);

		const client = createClient({
			host: editor.host(),
			auth: editor.auth(),
			modules: {
				widget,
			},
		});

		getInstance().then(({ site }) => {
			client
				.fetchWithAuth(
					`${getMiddlewareUrl()}/jobber/?clientUrl=${site?.siteId!}&query=${formType}`,
					{
						headers: {
							'x-jobber-integration': 'wix',
						},
						signal: abortController.signal,
					},
				)
				.then((res) => res.json())
				.then(({ data }) => {
					let embedScript = '';
					if (data?.requestSettings?.requestEmbedScript) {
						setEmbedScript(data.requestSettings.requestEmbedScript);
						embedScript = data.requestSettings.requestEmbedScript;
						onSuccess(embedScript);
					} else if (data?.onlineBookingConfiguration?.bookingEmbedScript) {
						setEmbedScript(data.onlineBookingConfiguration.bookingEmbedScript);
						embedScript = data.onlineBookingConfiguration.bookingEmbedScript;
						onSuccess(embedScript);
					} else {
						setError(new Error('No embed script found'));
					}
				})
				.catch((error) => {
					if (error.name === 'AbortError') {
						return;
					}
					console.log('error', error);
					setError(error);
				})
				.finally(() => {
					if (!abortController.signal.aborted) {
						setIsLoading(false);
					}
				});
		});

		return () => {
			abortController.abort();
		};
	}, [formType, onSuccess, shouldFetch]);

	return { embedScript, isLoading, error };
}
