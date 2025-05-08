export function getMiddlewareUrl() {
	return 'http://localhost:8000';
}

export function getAuthUrl(appInstance: string, returnUrl: string) {
	return `${getMiddlewareUrl()}/wix/auth?instance=${appInstance}&returnUrl=${returnUrl}`;
}
