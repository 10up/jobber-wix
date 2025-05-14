import React, { type FC, useState, useEffect, useCallback } from 'react';

import { widget } from '@wix/editor';
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
import { useFetchJobberForms, type FormType } from '../../../../hooks/useFetchJobberForms';

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

	const { isLoading, error, embedScript } = useFetchJobberForms({
		formType: formType as FormType,
	});

	useEffect(() => {
		if (embedScript) {
			widget.setProp('embed-script', JSON.stringify(embedScript));
		}
	}, [embedScript]);

	useEffect(() => {
		widget
			.getProp('form-type')
			.then((formType) => {
				setFormType(formType || 'request');
			})
			.catch((error) => console.error('Failed to fetch form-type:', error));
	}, [setFormType]);

	const handleFormTypeChange = useCallback(
		(option: DropdownLayoutValueOption) => {
			const newFormType = option.id.toString();
			setFormType(newFormType);
			widget.setProp('form-type', newFormType);
			widget.setProp(
				'embed-script',
				JSON.stringify({
					markup: '',
					scripts: [],
				}),
			);
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
						{!isLoading && !error && embedScript && (
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
