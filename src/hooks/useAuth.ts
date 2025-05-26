import { useState, useEffect, useCallback } from 'react';
import { dashboard } from '@wix/dashboard';
import { httpClient } from '@wix/essentials';
import { getMiddlewareUrl, getAuthUrl } from '../utils/api';
import { getAppInstanceFromUrl } from '../utils/wix';
import pageMetadata from '../dashboard/pages/page.json';
import { useIsConnected } from './useIsConnected';

type UseAuthResult = {
	isConnected: boolean;
	isCheckingConnection: boolean;
	isDisconnecting: boolean;
	authUrl: string;
	error: Error | null;
	disconnect: () => Promise<void>;
};

export function useAuth(): UseAuthResult {
	const {
		isConnected,
		isLoading: isCheckingConnection,
		error: connectionError,
		recheck,
	} = useIsConnected();
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

				const response = await httpClient.fetchWithAuth(
					`${getMiddlewareUrl()}/disconnect`,
					{
						method: 'POST',
						headers: {
							'x-jobber-integration': 'wix',
						},
					},
				);

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
		[recheck],
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
