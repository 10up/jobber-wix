import React, { type FC, useEffect, useState } from 'react';
import { dashboard } from '@wix/dashboard';
import { Button, Page, WixDesignSystemProvider, Box, Layout, Cell } from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import { Link as LinkIcon } from '@wix/wix-ui-icons-common';
import { getInstance } from '../../backend/get-instance.web';
import { getAuthUrl } from '../../utils/api';
import { Loading } from '../components/Loading';
import { NotConnected } from '../components/NotConnected';
import { Connected } from '../components/Connected';
import pageMetadata from './page.json';
import { getAppInstanceFromUrl } from '../../utils/wix';

async function getAuthorizationUrl() {
	const { site } = await getInstance();
	const instance = getAppInstanceFromUrl();
	const returnUrl = await dashboard.getPageUrl({
		pageId: pageMetadata.id,
	});
	return getAuthUrl(instance, site?.siteId!, returnUrl);
}

const Index: FC = () => {
	const [isConnected, setIsConnected] = useState(false);
	const [authUrl, setAuthUrl] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getAuthorizationUrl().then((url) => {
			setAuthUrl(url);
		});

		const checkConnection = async () => {
			setIsLoading(true);
			return new Promise((resolve) => {
				setTimeout(() => {
					setIsConnected(false);
					setIsLoading(false);
					resolve(false);
				}, 500);
			});
		};

		checkConnection();
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
