import React, { type FC } from 'react';
import { Box, Text } from '@wix/design-system';
import { Check as CheckIcon } from '@wix/wix-ui-icons-common';

export const Connected: FC = () => (
	<>
		<Box align="center" gap="12px" verticalAlign="middle">
			<CheckIcon size="48px" color="#389E0D" />
			<Text size="medium" weight="normal">
				Your Jobber account is successfully connected!
			</Text>
		</Box>
		<Text size="small" secondary>
			You can now embed Jobber forms directly from your Wix site.
		</Text>
	</>
);
