import React, { type FC, useState } from 'react';
import { Box, Button, EmptyState } from '@wix/design-system';
import { Link as LinkIcon } from '@wix/wix-ui-icons-common';
import jobberIcon from '../../assets/jobber-widget/jobber-icon.png';

type NotConnectedProps = {
	authUrl: string;
	isButtonDisabled: boolean;
};

export const NotConnected: FC<NotConnectedProps> = ({ authUrl, isButtonDisabled }) => {
	const [isRedirecting, setIsRedirecting] = useState(false);

	const handleConnectClick = (e: React.MouseEvent) => {
		if (window.top) {
			e.preventDefault();
			setIsRedirecting(true);
			window.top.location.href = authUrl;
		}
	};

	return (
		<EmptyState
			title="Connect Your Jobber Account"
			subtitle="Connect your Jobber account to be able to embed Jobber forms on your site."
			theme="page-no-border"
			image={<img src={jobberIcon} width="48" height="48" alt="Jobber icon" />}
		>
			<Box direction="vertical" gap="12px" align="center">
				<Button
					as="a"
					target="_blank"
					href={authUrl}
					prefixIcon={<LinkIcon />}
					priority="primary"
					disabled={isButtonDisabled || isRedirecting}
					onClick={handleConnectClick}
				>
					{isRedirecting ? 'Redirecting you to Jobber...' : 'Connect to Jobber'}
				</Button>
			</Box>
		</EmptyState>
	);
};
