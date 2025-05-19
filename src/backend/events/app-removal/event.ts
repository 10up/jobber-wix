import { appInstances } from '@wix/app-management';
import { httpClient } from '@wix/essentials';
import { getMiddlewareUrl } from '../../../utils/api';

appInstances.onAppInstanceRemoved(async () => {
	try {
		httpClient.fetchWithAuth(`${getMiddlewareUrl()}/disconnect`, {
			method: 'POST',
			headers: {
				'x-jobber-integration': 'wix',
			},
		});
	} catch (error) {
		console.error('Failed to disconnect during app removal:', error);
	}
});
