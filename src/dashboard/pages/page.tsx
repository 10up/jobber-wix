import React, { type FC, useEffect, useState } from 'react';
import { dashboard } from '@wix/dashboard';
import { Button, Page, WixDesignSystemProvider, Box, Layout, Cell } from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import { Link as LinkIcon } from '@wix/wix-ui-icons-common';
import { getAuthUrl } from '../../utils/api';
import { Loading } from '../components/Loading';
import { NotConnected } from '../components/NotConnected';
import { Connected } from '../components/Connected';
import pageMetadata from './page.json';
import { getAppInstanceFromUrl } from '../../utils/wix';
import { useIsConnected } from '../../hooks/useIsConnected';

async function getAuthorizationUrl() {
	const instance = getAppInstanceFromUrl();
	const returnUrl = await dashboard.getPageUrl({
		pageId: pageMetadata.id,
	});
	return getAuthUrl(instance, returnUrl);
}

const Index: FC = () => {
	const { isConnected, isLoading } = useIsConnected();
	const [authUrl, setAuthUrl] = useState('');

	useEffect(() => {
		getAuthorizationUrl().then((url) => {
			setAuthUrl(url);
		});
	}, []);

	const isAuthCheckLoading = isLoading || !authUrl;
	const isButtonDisabled = isAuthCheckLoading || isConnected;

	return (
		<WixDesignSystemProvider features={{ newColorsBranding: true }}>
			<Page>
				<Page.Header
					title="Jobber App"
					subtitle="Manage your Jobber connection"
					actionsBar={
						<Button
							as="a"
							target="_blank"
							href={authUrl}
							priority="primary"
							prefixIcon={<LinkIcon />}
							disabled={isButtonDisabled}
						>
							{isConnected ? 'Connected' : 'Connect Jobber'}
						</Button>
					}
				/>
				<Page.Content>
					<Layout>
						<Cell>
							<Box align="center" direction="vertical" gap="12px">
								{isAuthCheckLoading ? <Loading /> : null}
								{!isAuthCheckLoading && isConnected ? <Connected /> : null}
								{!isAuthCheckLoading && !isConnected ? (
									<NotConnected
										authUrl={authUrl}
										isButtonDisabled={isButtonDisabled}
									/>
								) : null}
							</Box>
						</Cell>
					</Layout>
				</Page.Content>
			</Page>
		</WixDesignSystemProvider>
	);
};

export default Index;
