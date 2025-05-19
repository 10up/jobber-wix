import React, { type FC } from 'react';
import { EmptyState, Loader } from '@wix/design-system';

export const Loading: FC = () => (
	<EmptyState
		title="Checking your connection to Jobber..."
		subtitle="Please wait while we check your connection..."
		theme="page-no-border"
		image={<Loader size="medium" />}
	/>
);
