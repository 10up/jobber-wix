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
	Text,
	Card,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import { Link as LinkIcon, Unlink as UnlinkIcon } from '@wix/wix-ui-icons-common';
import { Loading } from '../../components/Loading';
import { NotConnected } from '../../components/NotConnected';
import { Connected } from '../../components/Connected';
import { useAuth } from '../../../hooks/useAuth';
import thumbnail from '../../../assets/jobber-widget/thumbnail.png';

type ConnectionButtonProps = {
	isConnected: boolean;
	isDisconnecting: boolean;
	isButtonDisabled: boolean;
	authUrl: string;
	disconnect: (onDisconnect?: () => void) => Promise<void>;
};

// leaving this here for now, but we don't need it
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ConnectionButton: FC<ConnectionButtonProps> = ({
	isConnected,
	isDisconnecting,
	isButtonDisabled,
	authUrl,
	disconnect,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isRedirecting, setIsRedirecting] = useState(false);
	let buttonIcon = <LinkIcon />;
	let buttonText = 'Connect to Jobber';

	if (isConnected) {
		buttonIcon = <UnlinkIcon />;
		buttonText = 'Disconnect';
	}

	const handleDisconnectClick = () => {
		setIsModalOpen(true);
	};

	const handleConnectClick = (e: React.MouseEvent) => {
		if (window.top) {
			e.preventDefault();
			setIsRedirecting(true);
			window.top.location.href = authUrl;
		}
	};

	const handleConfirmDisconnect = async () => {
		disconnect(() => {
			setIsModalOpen(false);
		});
	};

	const getButtonText = () => {
		if (isConnected) {
			return buttonText;
		}
		return isRedirecting ? 'Redirecting you to Jobber...' : buttonText;
	};

	if (isConnected) {
		return null;
	}
	return (
		<>
			<Button
				onClick={isConnected ? handleDisconnectClick : handleConnectClick}
				as={!isConnected ? 'a' : undefined}
				target={!isConnected ? '_blank' : undefined}
				href={!isConnected ? authUrl : undefined}
				priority={isConnected ? 'secondary' : 'primary'}
				skin={isConnected ? 'destructive' : 'standard'}
				prefixIcon={buttonIcon}
				disabled={isButtonDisabled || isRedirecting}
			>
				{getButtonText()}
			</Button>

			<Modal
				isOpen={isModalOpen}
				onRequestClose={() => !isDisconnecting && setIsModalOpen(false)}
				shouldCloseOnOverlayClick={!isDisconnecting}
			>
				<MessageModalLayout
					title="Disconnect Jobber"
					content={
						<Box direction="vertical" gap="12px">
							<Text>Are you sure you want to disconnect?</Text>
							<Text>
								This will remove the connection between your Wix site and Jobber.
							</Text>
						</Box>
					}
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
	const { isConnected, isCheckingConnection, authUrl } = useAuth();

	return (
		<WixDesignSystemProvider features={{ newColorsBranding: true }}>
			<Page>
				<Page.Header
					title={
						<Box gap="12px" align="center">
							<img
								src={thumbnail}
								alt="Jobber Logo"
								style={{ height: '64px', width: 'auto' }}
							/>
						</Box>
					}
				/>
				<Page.Content>
					<Layout>
						<Cell span={8}>
							<Card>
								<Card.Header title="Connection Status" />
								<Card.Divider />
								<Card.Content>
									<Box align="center" direction="vertical">
										{isCheckingConnection ? <Loading /> : null}
										{!isCheckingConnection && isConnected ? (
											<Connected />
										) : null}
										{!isCheckingConnection && !isConnected ? (
											<NotConnected
												authUrl={authUrl}
												isButtonDisabled={isCheckingConnection}
											/>
										) : null}
									</Box>
								</Card.Content>
							</Card>
						</Cell>
						<Cell span={4}>
							<Card>
								<Card.Header title="About" />
								<Card.Divider />
								<Card.Content>
									<Text>
										The Jobber Wix App allows you to embed Request and Booking
										forms.
										<br />
										<br />
										The forms must be created and customized in your Jobber
										dashboard.
										<br />
										<br />
										Don&apos;t have a Jobber account?{' '}
										<a
											href="https://getjobber.com/signup"
											target="_blank"
											rel="noopener noreferrer"
											style={{ color: '#3899EC', textDecoration: 'none' }}
										>
											Create one here
										</a>
									</Text>
								</Card.Content>
							</Card>
						</Cell>
					</Layout>
				</Page.Content>
			</Page>
		</WixDesignSystemProvider>
	);
};

export default Index;
