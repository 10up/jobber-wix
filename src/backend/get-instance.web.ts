import { webMethod, Permissions } from '@wix/web-methods';
import { auth } from '@wix/essentials';
import { appInstances } from '@wix/app-management';

export const getInstance = webMethod(Permissions.SiteMember, async () => {
	const { instanceId } = await auth.getTokenInfo();
	console.log(`App instance ID: ${instanceId}`);
	// (Optional) Fetch app instance data from Wix
	const elevatedGetAppInstance = auth.elevate(appInstances.getAppInstance);
	const { instance, site } = await elevatedGetAppInstance();
	console.log('Response from Get App Instance:', { instance, site });

	return { instance, site };
});
