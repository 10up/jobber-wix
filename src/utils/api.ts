export function getMiddlewareUrl() {
	return 'http://localhost:8000';
}

export function getAuthUrl(instanceId: string, siteId: string, returnUrl: string) {
	return `${getMiddlewareUrl()}/wix/auth?instanceId=${instanceId}&siteId=${siteId}&returnUrl=${returnUrl}`;
}
