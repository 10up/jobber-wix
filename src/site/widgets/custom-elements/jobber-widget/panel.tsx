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
import { v4 as uuidv4 } from 'uuid';
import useDeepCompareEffect from 'use-deep-compare-effect';
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
	const [formType, setFormType] = useState<FormType | null>(null);

	const { isLoading, error, embedScript } = useFetchJobberForms({
		formType,
	});

	useDeepCompareEffect(() => {
		if (embedScript.markup.length > 0) {
			widget.setProp('embed-script', JSON.stringify(embedScript));
		}
	}, [embedScript]);

	useEffect(() => {
		widget
			.getProp('form-type')
			.then((formType) => {
				if (formType) {
					setFormType(formType as FormType);
				}
			})
			.catch((error) => console.error('Failed to fetch form-type:', error));

		widget.getProp('id').then((id) => {
			if (!id) {
				widget.setProp('id', `jobber-widget-${uuidv4()}`);
			}
		});
	}, [setFormType]);

	const handleFormTypeChange = useCallback(
		(option: DropdownLayoutValueOption) => {
			const newFormType = option.id.toString();
			widget.setProp('form-type', newFormType).then(() => {
				setFormType(newFormType as FormType);
			});
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
								selectedId={formType ?? undefined}
								options={options}
								onSelect={handleFormTypeChange}
								aria-label="Form Type"
								placeholder="Select a form to display"
							/>
						</FormField>
					</SidePanel.Field>
				</SidePanel.Content>
				{isLoading || error || embedScript.markup.length > 0 ? (
					<SidePanel.Footer noPadding>
						<SectionHelper
							fullWidth
							appearance={error && !isLoading ? 'warning' : 'success'}
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
							{error && !isLoading && (
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										gap: '8px',
									}}
								>
									<Text size="small" weight="normal">
										{error.message}
									</Text>
								</div>
							)}
							{!isLoading && !error && embedScript.markup.length > 0 && (
								<Text size="small" weight="normal">
									Jobber form fetched successfully.
								</Text>
							)}
						</SectionHelper>
					</SidePanel.Footer>
				) : null}
			</SidePanel>
		</WixDesignSystemProvider>
	);
};

export default Panel;
