import { webMethod, Permissions } from '@wix/web-methods';
import { auth } from '@wix/essentials';
import { appInstances } from '@wix/app-management';

// https://dev.wix.com/docs/build-apps/develop-your-app/frameworks/self-hosting/supported-extensions/site-extensions/site-widgets-and-plugins/identify-the-app-instance-in-a-self-hosted-site-widget
export const getInstance = webMethod(Permissions.SiteMember, async () => {
	const elevatedGetAppInstance = auth.elevate(appInstances.getAppInstance);
	const { instance, site } = await elevatedGetAppInstance();

	return { instance, site };
});
