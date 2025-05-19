import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@wix/sdk';
import { dashboard } from '@wix/dashboard';
import { editor } from '@wix/editor';
import { getMiddlewareUrl, getAuthUrl } from '../utils/api';
import { getAppInstanceFromUrl } from '../utils/wix';
import pageMetadata from '../dashboard/pages/page.json';
import { useIsConnected } from './useIsConnected';

type Context = 'dashboard' | 'widget';

type UseAuthResult = {
	isConnected: boolean;
	isCheckingConnection: boolean;
	isDisconnecting: boolean;
	authUrl: string;
	error: Error | null;
	disconnect: () => Promise<void>;
};

export function useAuth(context: Context = 'dashboard'): UseAuthResult {
	const {
		isConnected,
		isLoading: isCheckingConnection,
		error: connectionError,
		recheck,
	} = useIsConnected(context);
	const [isDisconnecting, setIsDisconnecting] = useState(false);
	const [authUrl, setAuthUrl] = useState('');
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const getAuthorizationUrl = async () => {
			const instance = getAppInstanceFromUrl();
			const returnUrl = await dashboard.getPageUrl({
				pageId: pageMetadata.id,
			});
			setAuthUrl(getAuthUrl(instance, returnUrl));
		};

		getAuthorizationUrl();
	}, []);

	const disconnect = useCallback(
		async (onDisconnect?: () => void) => {
			try {
				setIsDisconnecting(true);
				setError(null);

				const client = createClient({
					host: context === 'dashboard' ? dashboard.host() : editor.host(),
					// @ts-expect-error
					auth: context === 'dashboard' ? dashboard.auth() : editor.auth(),
				});

				const response = await client.fetchWithAuth(`${getMiddlewareUrl()}/disconnect`, {
					method: 'POST',
					headers: {
						'x-jobber-integration': 'wix',
					},
				});

				if (!response.ok) {
					throw new Error('Failed to disconnect');
				}

				onDisconnect?.();
				await recheck();
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error('Failed to disconnect from Jobber'),
				);
			} finally {
				setIsDisconnecting(false);
			}
		},
		[context, recheck],
	);

	return {
		isConnected,
		isCheckingConnection,
		isDisconnecting,
		authUrl,
		error: error || connectionError,
		disconnect,
	};
}
