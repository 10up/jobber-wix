import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@wix/sdk';
import { dashboard } from '@wix/dashboard';
import { editor } from '@wix/editor';
import { getMiddlewareUrl } from '../utils/api';

type Context = 'dashboard' | 'widget';

type UseIsConnectedResult = {
	isConnected: boolean;
	isLoading: boolean;
	error: Error | null;
	recheck: () => Promise<void>;
};

export function useIsConnected(context: Context = 'dashboard'): UseIsConnectedResult {
	const [isConnected, setIsConnected] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const checkConnection = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const client = createClient({
				host: context === 'dashboard' ? dashboard.host() : editor.host(),
				// @ts-expect-error
				auth: context === 'dashboard' ? dashboard.auth() : editor.auth(),
			});

			const response = await client.fetchWithAuth(`${getMiddlewareUrl()}/wix/auth-check`);
			const data = await response.json();

			setIsConnected(data.success);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to check connection status'));
			setIsConnected(false);
		} finally {
			setIsLoading(false);
		}
	}, [context]);

	useEffect(() => {
		checkConnection();
	}, [checkConnection]);

	return { isConnected, isLoading, error, recheck: checkConnection };
}
