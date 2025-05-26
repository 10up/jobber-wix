import { appInstances } from '@wix/app-management';
import { httpClient } from '@wix/essentials';
import { getMiddlewareUrl } from '../../../utils/api';

appInstances.onAppInstanceRemoved(async () => {
	try {
		console.log('App Removal Event: Disconnecting from Jobber');
		const res = await httpClient.fetchWithAuth(`${getMiddlewareUrl()}/disconnect`, {
			method: 'POST',
			headers: {
				'x-jobber-integration': 'wix',
			},
		});
		console.log('App Removal Event: Disconnected from Jobber', await res.text());
	} catch (error) {
		console.error('Failed to disconnect during app removal:', error);
	}
});
