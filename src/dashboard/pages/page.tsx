import React, { type FC, useEffect, useState } from 'react';
import { dashboard } from '@wix/dashboard';
import { Button, Page, WixDesignSystemProvider, Box, Text, Layout, Cell } from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import * as Icons from '@wix/wix-ui-icons-common';
import { getInstance } from '../../backend/get-instance.web';

const Index: FC = () => {
	const [isConnected, setIsConnected] = useState(false);
	const [authUrl, setAuthUrl] = useState('');

	const getAuthorizationUrl = async () => {
		const { instance, site } = await getInstance();
		const returnUrl = await dashboard.getPageUrl({
			pageId: '2b8b12d1-88a3-41e1-bd8e-c67c6a774b7b',
		});
		return `http://localhost:8000/wix/auth?instanceId=${instance?.instanceId}&siteId=${site?.siteId}&returnUrl=${returnUrl}`;
	};

	useEffect(() => {
		const getAuthUrl = async () => {
			const url = await getAuthorizationUrl();
			setAuthUrl(url);
		};
		const checkConnection = async () => {
			return new Promise((resolve) => {
				setTimeout(() => {
					setIsConnected(false);
					resolve(false);
				}, 1000);
			});
		};
		getAuthUrl();
		checkConnection();
	}, []);

	return (
		<WixDesignSystemProvider features={{ newColorsBranding: true }}>
			<Page>
				<Page.Header
					title="Jobber Integration"
					subtitle="Connect your Jobber account to your Wix site."
					actionsBar={
						<Button
							as="a"
							target="_blank"
							href={authUrl}
							priority="primary"
							disabled={isConnected || !authUrl}
						>
							{isConnected ? 'Connected' : 'Connect Jobber'}
						</Button>
					}
				/>
				<Page.Content>
					<Layout>
						<Cell>
							<Box align="center" direction="vertical" gap="12px">
								<Box align="center" gap="12px" verticalAlign="middle">
									{isConnected ? (
										<Icons.Check size="48px" color="#389E0D" />
									) : (
										<Icons.Info size="48px" color="#FAAD14" />
									)}
									<Text size="medium" weight="normal">
										{isConnected
											? 'Your Jobber account is successfully connected!'
											: 'Connect your Jobber account to be able to embed Jobber forms on your site.'}
									</Text>
								</Box>
								<Text size="small" secondary>
									{isConnected
										? 'You can now embed Jobber forms directly from your Wix site.'
										: 'This integration will allow you to embed Jobber forms on your site.'}
								</Text>
								{!isConnected && (
									<Button
										as="a"
										target="_blank"
										href={authUrl}
										prefixIcon={<Icons.Link />}
										priority="primary"
										disabled={isConnected || !authUrl}
									>
										Connect Jobber
									</Button>
								)}
							</Box>
						</Cell>
					</Layout>
				</Page.Content>
			</Page>
		</WixDesignSystemProvider>
	);
};

export default Index;
