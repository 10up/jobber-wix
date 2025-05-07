import { webMethod, Permissions } from '@wix/web-methods';
import { auth } from '@wix/essentials';
import { appInstances } from '@wix/app-management';

export const getInstance = webMethod(Permissions.SiteMember, async () => {
	const elevatedGetAppInstance = auth.elevate(appInstances.getAppInstance);
	const { instance, site } = await elevatedGetAppInstance();

	return { instance, site };
});
