import { useState, useEffect, useCallback } from 'react';
import { httpClient } from '@wix/essentials';
import { getMiddlewareUrl } from '../utils/api';

type UseIsConnectedResult = {
	isConnected: boolean;
	isLoading: boolean;
	error: Error | null;
	recheck: () => Promise<void>;
};

export function useIsConnected(): UseIsConnectedResult {
	const [isConnected, setIsConnected] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const checkConnection = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await httpClient.fetchWithAuth(`${getMiddlewareUrl()}/wix/auth-check`);
			const data = await response.json();

			setIsConnected(data.success);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to check connection status'));
			setIsConnected(false);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		checkConnection();
	}, [checkConnection]);

	return { isConnected, isLoading, error, recheck: checkConnection };
}
