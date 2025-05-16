import React, { type FC, useState } from 'react';
import {
	Button,
	Page,
	WixDesignSystemProvider,
	Box,
	Layout,
	Cell,
	Loader,
	Modal,
	MessageModalLayout,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import { Link as LinkIcon, Unlink as UnlinkIcon } from '@wix/wix-ui-icons-common';
import { Loading } from '../components/Loading';
import { NotConnected } from '../components/NotConnected';
import { Connected } from '../components/Connected';
import { useAuth } from '../../hooks/useAuth';

type ConnectionButtonProps = {
	isConnected: boolean;
	isDisconnecting: boolean;
	isButtonDisabled: boolean;
	authUrl: string;
	disconnect: () => void;
};

const ConnectionButton: FC<ConnectionButtonProps> = ({
	isConnected,
	isDisconnecting,
	isButtonDisabled,
	authUrl,
	disconnect,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	let buttonIcon = <LinkIcon />;
	let buttonText = 'Connect to Jobber';

	if (isConnected) {
		buttonIcon = <UnlinkIcon />;
		buttonText = 'Disconnect';
	}

	const handleDisconnectClick = () => {
		setIsModalOpen(true);
	};

	const handleConfirmDisconnect = async () => {
		await disconnect();
		setIsModalOpen(false);
	};

	return (
		<>
			<Button
				onClick={isConnected ? handleDisconnectClick : undefined}
				as={!isConnected ? 'a' : undefined}
				target={!isConnected ? '_blank' : undefined}
				href={!isConnected ? authUrl : undefined}
				priority={isConnected ? 'secondary' : 'primary'}
				skin={isConnected ? 'destructive' : 'standard'}
				prefixIcon={buttonIcon}
				disabled={isButtonDisabled}
			>
				{buttonText}
			</Button>

			<Modal
				isOpen={isModalOpen}
				onRequestClose={() => !isDisconnecting && setIsModalOpen(false)}
				shouldCloseOnOverlayClick={!isDisconnecting}
			>
				<MessageModalLayout
					title="Disconnect Jobber"
					content="Are you sure you want to disconnect? This will remove the connection between your Wix site and Jobber."
					primaryButtonText={isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
					secondaryButtonText="Cancel"
					primaryButtonOnClick={handleConfirmDisconnect}
					secondaryButtonOnClick={() => setIsModalOpen(false)}
					theme="destructive"
					secondaryButtonProps={{
						disabled: isDisconnecting,
					}}
					primaryButtonProps={{
						prefixIcon: isDisconnecting ? (
							<Box paddingRight="6px">
								<Loader size="tiny" />
							</Box>
						) : undefined,
						disabled: isDisconnecting,
					}}
				/>
			</Modal>
		</>
	);
};

const Index: FC = () => {
	const { isConnected, isCheckingConnection, isDisconnecting, authUrl, disconnect } = useAuth();

	return (
		<WixDesignSystemProvider features={{ newColorsBranding: true }}>
			<Page>
				<Page.Header
					title="Jobber App"
					subtitle="Manage your Jobber connection"
					actionsBar={
						<Box gap="12px">
							<ConnectionButton
								isConnected={isConnected}
								isDisconnecting={isDisconnecting}
								isButtonDisabled={isCheckingConnection}
								authUrl={authUrl}
								disconnect={disconnect}
							/>
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
										isButtonDisabled={isCheckingConnection}
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
