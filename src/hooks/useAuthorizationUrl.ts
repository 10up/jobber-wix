import { useState, useEffect } from 'react';
import { dashboard } from '@wix/dashboard';
import { getAuthUrl } from '../utils/api';
import { getAppInstanceFromUrl } from '../utils/wix';
import pageMetadata from '../dashboard/pages/page.json';

async function getAuthorizationUrl() {
	const instance = getAppInstanceFromUrl();
	const returnUrl = await dashboard.getPageUrl({
		pageId: pageMetadata.id,
	});
	return getAuthUrl(instance, returnUrl);
}

export function useAuthorizationUrl() {
	const [authUrl, setAuthUrl] = useState('');

	useEffect(() => {
		getAuthorizationUrl().then((url) => {
			setAuthUrl(url);
		});
	}, []);

	return authUrl;
}
