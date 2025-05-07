import React, { type FC, useEffect, useState } from 'react';
import { dashboard } from '@wix/dashboard';
import {
	Button,
	Page,
	WixDesignSystemProvider,
	Box,
	Text,
	Layout,
	Cell,
	Loader,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import * as Icons from '@wix/wix-ui-icons-common';
import { getInstance } from '../../backend/get-instance.web';
import { getAuthUrl } from '../../utils/api';

const Index: FC = () => {
	const [isConnected, setIsConnected] = useState(false);
	const [authUrl, setAuthUrl] = useState('');
	const [isLoading, setIsLoading] = useState(true);

	const getAuthorizationUrl = async () => {
		const { instance, site } = await getInstance();
		const returnUrl = await dashboard.getPageUrl({
			pageId: '2b8b12d1-88a3-41e1-bd8e-c67c6a774b7b',
		});
		return getAuthUrl(instance?.instanceId!, site?.siteId!, returnUrl);
	};

	useEffect(() => {
		const getAuthUrl = async () => {
			const url = await getAuthorizationUrl();
			setAuthUrl(url);
		};
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
		getAuthUrl();
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
							prefixIcon={<Icons.Link />}
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
								{isAuthCheckLoading ? (
									<Box align="center" gap="12px" verticalAlign="middle">
										<Loader size="medium" />
										<Text size="medium" weight="normal">
											Checking your connection to Jobber...
										</Text>
									</Box>
								) : (
									<>
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
												disabled={isButtonDisabled}
											>
												Connect Jobber
											</Button>
										)}
									</>
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
