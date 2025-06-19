import React, { useState, type FC } from 'react';
import { Box, Text, EmptyState, Button } from '@wix/design-system';
import { Edit as EditIcon } from '@wix/wix-ui-icons-common';
import { httpClient } from '@wix/essentials';
import jobberIcon from '../../assets/jobber-widget/jobber-icon.png';

export const Connected: FC = () => {
	const [isOpening, setIsOpening] = useState(false);
	const handleOpenEditor = async () => {
		setIsOpening(true);
		const res = await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/editor-url`);

		const data = await res.json();

		if (data?.urls?.editorUrl) {
			if (window.top) {
				window.top.location.href = data.urls.editorUrl;
			} else {
				window.location.href = data.urls.editorUrl;
			}
		}
	};

	return (
		<EmptyState
			title="Successfully Connected to Jobber"
			subtitle="Your Jobber account is now connected to your Wix site."
			theme="page-no-border"
			image={<img src={jobberIcon} width="48" height="48" alt="Jobber icon" />}
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
							3. Select the form you want to embed in the widget&apos;s settings panel
							and publish.
						</Text>
					</Box>
				</Box>
				<Button
					prefixIcon={<EditIcon />}
					priority="secondary"
					onClick={handleOpenEditor}
					disabled={isOpening}
				>
					{isOpening ? 'Opening Site Editor...' : 'Open Site Editor'}
				</Button>
			</Box>
		</EmptyState>
	);
};
