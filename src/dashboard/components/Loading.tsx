import React, { type FC } from 'react';
import { Box, Text, Loader } from '@wix/design-system';

export const Loading: FC = () => (
	<Box align="center" gap="12px" verticalAlign="middle">
		<Loader size="medium" />
		<Text size="medium" weight="normal">
			Checking your connection to Jobber...
		</Text>
	</Box>
);
