import React, { type FC, useState, useEffect, useCallback, useRef } from 'react';

import { widget, editor } from '@wix/editor';
import {
	SidePanel,
	WixDesignSystemProvider,
	Dropdown,
	FormField,
	SectionHelper,
	DropdownLayoutValueOption,
	Loader,
	Text,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import { useFetchJobberForms } from '../../../../hooks/useFetchJobberForms';

const options = [
	{
		id: 'request',
		value: 'Request',
	},
	{
		id: 'booking',
		value: 'Booking',
	},
];

const Panel: FC = () => {
	const [formType, setFormType] = useState<string>();
	const previousFormTypeRef = useRef<string | null>(null);
	const [currentEmbedScript, setCurrentEmbedScript] = useState<string | null>(null);

	const shouldFetch = useCallback(() => {
		if (!formType) {
			return false;
		}

		// Fetch if form type changed
		if (
			typeof previousFormTypeRef.current === 'string' &&
			formType !== previousFormTypeRef.current
		) {
			return true;
		}

		// Fetch if no embed script
		if (typeof currentEmbedScript === 'string' && currentEmbedScript.length === 0) {
			return true;
		}

		return false;
	}, [formType, currentEmbedScript]);

	const onSuccess = useCallback(
		(embedScript: string) => {
			widget.setProp('embed-script', embedScript);
			setCurrentEmbedScript(embedScript);
			previousFormTypeRef.current = formType ?? null;
		},
		[formType],
	);

	const { isLoading, error } = useFetchJobberForms({
		formType: formType as 'request' | 'booking',
		onSuccess,
		shouldFetch,
	});

	useEffect(() => {
		widget
			.getProp('form-type')
			.then((formType) => {
				setFormType(formType || 'request');
				previousFormTypeRef.current = formType || null;
			})
			.catch((error) => console.error('Failed to fetch form-type:', error));
	}, [setFormType]);

	useEffect(() => {
		widget
			.getProp('embed-script')
			.then((embedScript) => {
				setCurrentEmbedScript(embedScript || '');
			})
			.catch((error) => console.error('Failed to fetch embed-script:', error));
	}, [setCurrentEmbedScript]);

	const handleFormTypeChange = useCallback(
		(option: DropdownLayoutValueOption) => {
			const newFormType = option.id.toString();
			setFormType(newFormType);
			widget.setProp('form-type', newFormType);
		},
		[setFormType],
	);

	return (
		<WixDesignSystemProvider>
			<SidePanel width="300" height="100vh">
				<SidePanel.Content noPadding stretchVertically>
					<SidePanel.Field>
						<FormField label="Form Type">
							<Dropdown
								selectedId={formType}
								options={options}
								onSelect={handleFormTypeChange}
								aria-label="Form Type"
							/>
						</FormField>
					</SidePanel.Field>
				</SidePanel.Content>
				<SidePanel.Footer noPadding>
					<SectionHelper
						fullWidth
						appearance={error ? 'warning' : 'success'}
						border="topBottom"
					>
						{isLoading && (
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '8px',
								}}
							>
								<Loader size="tiny" />
								<Text size="small" weight="normal">
									Fetching Jobber form...
								</Text>
							</div>
						)}
						{error && (
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '8px',
								}}
							>
								<Text size="small" weight="normal">
									Error fetching Jobber form. Please try again.
								</Text>
							</div>
						)}
						{!isLoading && !error && currentEmbedScript && (
							<Text size="small" weight="normal">
								Jobber form fetched successfully.
							</Text>
						)}
					</SectionHelper>
				</SidePanel.Footer>
			</SidePanel>
		</WixDesignSystemProvider>
	);
};

export default Panel;
