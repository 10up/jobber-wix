import React, { type FC } from 'react';
import { Button, Page, WixDesignSystemProvider, Box, Layout, Cell } from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import { Link as LinkIcon } from '@wix/wix-ui-icons-common';
import { Loading } from '../components/Loading';
import { NotConnected } from '../components/NotConnected';
import { Connected } from '../components/Connected';
import { useIsConnected } from '../../hooks/useIsConnected';
import { useAuthorizationUrl } from '../../hooks/useAuthorizationUrl';

const Index: FC = () => {
	const { isConnected, isLoading } = useIsConnected();
	const authUrl = useAuthorizationUrl();

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
