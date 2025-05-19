import React, { type FC } from 'react';
import { Box, Text, EmptyState, Button } from '@wix/design-system';
import { Check as CheckIcon, Edit as EditIcon } from '@wix/wix-ui-icons-common';
import { editor } from '@wix/urls';

export const Connected: FC = () => {
	const handleOpenEditor = async () => {
		const response = await editor.getEditorUrls();
		console.log(response);
	};

	return (
		<EmptyState
			title="Successfully Connected to Jobber"
			subtitle="Your Jobber account is now connected to your Wix site."
			theme="page-no-border"
			image={<CheckIcon size="48px" color="#389E0D" />}
		>
			<Box direction="vertical" gap="24px" align="center">
				<Box direction="vertical" gap="12px" align="center">
					<Text size="medium" weight="normal">
						You can now embed Jobber forms on your site
					</Text>
					<Text size="small" secondary>
						To add Jobber forms to your site:
					</Text>
					<Box direction="vertical" gap="8px" align="center">
						<Text size="small" secondary>
							1. Go to your site editor
						</Text>
						<Text size="small" secondary>
							2. Add the Jobber Forms widget to your page
						</Text>
						<Text size="small" secondary>
							3. Configure the form settings in the widget
						</Text>
					</Box>
				</Box>
				<Button prefixIcon={<EditIcon />} priority="secondary" onClick={handleOpenEditor}>
					Open Site Editor
				</Button>
			</Box>
		</EmptyState>
	);
};
