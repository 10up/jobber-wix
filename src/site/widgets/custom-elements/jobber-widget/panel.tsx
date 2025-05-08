import React, { type FC, useState, useEffect, useCallback } from 'react';
import { createClient } from '@wix/sdk';
import { editor, widget } from '@wix/editor';
import {
	SidePanel,
	WixDesignSystemProvider,
	Dropdown,
	FormField,
	SectionHelper,
	DropdownLayoutValueOption,
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import { getInstance } from '../../../../backend/get-instance.web';
import { getMiddlewareUrl } from '../../../../utils/api';

const SITE_WIDGETS_DOCS =
	'https://dev.wix.com/docs/build-apps/develop-your-app/frameworks/wix-cli/supported-extensions/site-extensions/site-widgets/site-widget-extension-files-and-code';

const Panel: FC = () => {
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
	const [formType, setFormType] = useState<string>(options[0].id);

	useEffect(() => {
		const client = createClient({
			host: editor.host(),
			auth: editor.auth(),
			modules: {
				widget,
			},
		});
		getInstance().then(({ site }) => {
			client
				.fetchWithAuth(
					`${getMiddlewareUrl()}/jobber/?clientUrl=${site?.siteId!}&query=${formType}`,
					{
						headers: {
							'x-jobber-integration': 'wix',
						},
					},
				)
				.then((res) => res.json())
				.then((data) => {
					console.log('data', data);
				});
		});
	}, [formType]);

	useEffect(() => {
		widget
			.getProp('form-type')
			.then((formType) => setFormType(formType || 'request'))
			.catch((error) => console.error('Failed to fetch form-type:', error));
	}, [setFormType]);

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
					<SectionHelper fullWidth appearance="success" border="topBottom">
						Learn more about{' '}
						<a
							href={SITE_WIDGETS_DOCS}
							target="_blank"
							rel="noopener noreferrer"
							title="Site Widget docs"
						>
							Site Widgets
						</a>
					</SectionHelper>
				</SidePanel.Footer>
			</SidePanel>
		</WixDesignSystemProvider>
	);
};

export default Panel;
