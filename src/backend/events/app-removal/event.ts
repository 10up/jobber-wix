import { appInstances } from '@wix/app-management';
import { auth } from '@wix/essentials';
import { getMiddlewareUrl } from '../../../utils/api';

appInstances.onAppInstanceRemoved(async (data) => {
	console.log(data);
	try {
		console.log('appInstances.onAppInstanceRemoved');
		const elevatedFetch = auth.elevate(fetch);
		await elevatedFetch(`${getMiddlewareUrl()}/disconnect`, {
			method: 'POST',
			headers: {
				'x-jobber-integration': 'wix',
			},
		});
		console.log('appInstances.onAppInstanceRemoved success');
	} catch (error) {
		console.error('Failed to disconnect during app removal:', error);
	}
});
