import { isProd } from './env';

export function getMiddlewareUrl() {
	if (isProd()) {
		return 'https://jobber-prod.10upmanaged.io';
	}

	return 'http://localhost:8000';
}

export function getAuthUrl(appInstance: string, returnUrl: string) {
	return `${getMiddlewareUrl()}/wix/auth?instance=${appInstance}&returnUrl=${returnUrl}`;
}
