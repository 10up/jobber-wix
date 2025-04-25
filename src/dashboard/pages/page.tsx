import React, { type FC, useState } from 'react';
import { dashboard } from '@wix/dashboard';
import { Button, Page, WixDesignSystemProvider, Box, Text, Layout, Cell } from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import * as Icons from '@wix/wix-ui-icons-common';
import { getAppInstance, getClientUrl } from '../../utils/wix';

const Index: FC = () => {
	const [isConnected, setIsConnected] = useState(false);

	const handleConnectJobber = async () => {
		// TODO: Implement Jobber connection logic
		setIsConnected(true);
		dashboard.showToast({
			message: 'Successfully connected to Jobber!',
		});
	};

	const getAuthUrl = () => {
		const token = getAppInstance();
		const clientUrl = window.location.origin;
		const returnUrl = window.location.href;
		return `http://localhost:8000/wix/auth?jobber_token=${token}&clientUrl=${clientUrl}&returnUrl=${returnUrl}`;
	};

	return (
		<WixDesignSystemProvider features={{ newColorsBranding: true }}>
			<Page>
				<Page.Header
					title="Jobber Integration"
					subtitle="Connect your Jobber account to your Wix site."
					actionsBar={
						<Button
							as="a"
							href={getAuthUrl()}
							prefixIcon={<Icons.Link />}
							priority="primary"
							disabled={isConnected}
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
										href={getAuthUrl()}
										prefixIcon={<Icons.Link />}
										priority="primary"
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
