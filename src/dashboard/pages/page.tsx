import React, { type FC } from 'react';
import {
	Button,
	Page,
	WixDesignSystemProvider,
	Box,
	Layout,
	Cell,
	Loader,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import { Link as LinkIcon, Unlink as UnlinkIcon } from '@wix/wix-ui-icons-common';
import { Loading } from '../components/Loading';
import { NotConnected } from '../components/NotConnected';
import { Connected } from '../components/Connected';
import { useAuth } from '../../hooks/useAuth';

const Index: FC = () => {
	const { isConnected, isCheckingConnection, isDisconnecting, authUrl, disconnect } = useAuth();

	const isButtonDisabled = isCheckingConnection || isConnected;

	return (
		<WixDesignSystemProvider features={{ newColorsBranding: true }}>
			<Page>
				<Page.Header
					title="Jobber App"
					subtitle="Manage your Jobber connection"
					actionsBar={
						<Box gap="12px">
							{isConnected && (
								<Button
									onClick={disconnect}
									priority="secondary"
									prefixIcon={
										isDisconnecting ? <Loader size="tiny" /> : <UnlinkIcon />
									}
									disabled={isDisconnecting}
								>
									{isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
								</Button>
							)}
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
						</Box>
					}
				/>
				<Page.Content>
					<Layout>
						<Cell>
							<Box align="center" direction="vertical" gap="12px">
								{isCheckingConnection ? <Loading /> : null}
								{!isCheckingConnection && isConnected ? <Connected /> : null}
								{!isCheckingConnection && !isConnected ? (
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
