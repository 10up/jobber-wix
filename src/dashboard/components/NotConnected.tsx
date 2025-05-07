import React, { type FC } from 'react';
import { Box, Text, Button } from '@wix/design-system';
import { Info as InfoIcon, Link as LinkIcon } from '@wix/wix-ui-icons-common';

interface NotConnectedProps {
	authUrl: string;
	isButtonDisabled: boolean;
}

export const NotConnected: FC<NotConnectedProps> = ({ authUrl, isButtonDisabled }) => (
	<>
		<Box align="center" gap="12px" verticalAlign="middle">
			<InfoIcon size="48px" color="#FAAD14" />
			<Text size="medium" weight="normal">
				Connect your Jobber account to be able to embed Jobber forms on your site.
			</Text>
		</Box>
		<Text size="small" secondary>
			This integration will allow you to embed Jobber forms on your site.
		</Text>
		<Button
			as="a"
			target="_blank"
			href={authUrl}
			prefixIcon={<LinkIcon />}
			priority="primary"
			disabled={isButtonDisabled}
		>
			Connect Jobber
		</Button>
	</>
);
