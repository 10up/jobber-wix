import React, { type FC, useState, useEffect, useCallback, useMemo } from 'react';

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
	Button,
	Box,
} from '@wix/design-system';

import '@wix/design-system/styles.global.css';
import { v4 as uuidv4 } from 'uuid';
import {
	useJobberForms,
	type EmbedObject,
	type JobberForm,
} from '../../../../hooks/useFetchJobberForms';
import pageMetadata from '../../../../dashboard/pages/page.json';
import { getInstance } from '../../../../backend/get-app-instance.web';

/**
 * Store a form on the widget: its processed embed, which is what the site widget
 * renders, with the form's id alongside it to remember the choice.
 *
 * The id lives inside the embed prop rather than a prop of its own because Wix only
 * kept the first value written to a new prop and ignored later changes.
 *
 * @param form The form to store
 * @returns {Promise<boolean>} False when the form's embed could not be processed
 */
async function storeForm(form: JobberForm): Promise<boolean> {
	// Never replace a working embed with an empty one.
	if (!form.inline?.markup) {
		return false;
	}

	await widget.setProp('embed-script', JSON.stringify({ ...form.inline, formId: form.id }));
	return true;
}

/**
 * Read the chosen form's id back from the stored embed.
 *
 * @param savedEmbed The widget's embed-script prop
 * @returns {string | null} The form id, or null when none was stored
 */
function getSavedFormId(savedEmbed: unknown): string | null {
	try {
		const embed: EmbedObject =
			typeof savedEmbed === 'string' ? JSON.parse(savedEmbed) : (savedEmbed as EmbedObject);
		return embed?.formId || null;
	} catch {
		return null;
	}
}

const Panel: FC = () => {
	const [formId, setFormId] = useState<string | null>(null);
	// A widget saved before forms were listed per account has a form type and no form id.
	const [legacyFormType, setLegacyFormType] = useState<string | null>(null);
	const [propsLoaded, setPropsLoaded] = useState(false);
	const [storeError, setStoreError] = useState<string | null>(null);
	// True once a widget whose form was turned off or deleted in Jobber is moved to the default.
	const [fellBackToDefault, setFellBackToDefault] = useState(false);
	const [dashboardUrl, setDashboardUrl] = useState('');
	const [isNavigating, setIsNavigating] = useState(false);

	const { forms, isLoading, error } = useJobberForms();

	useEffect(() => {
		Promise.all([widget.getProp('embed-script'), widget.getProp('form-type')])
			.then(([savedEmbed, savedFormType]) => {
				setFormId(getSavedFormId(savedEmbed));
				setLegacyFormType(savedFormType || null);
			})
			.catch((err) => console.error('Failed to read widget settings:', err))
			.finally(() => setPropsLoaded(true));

		widget.getProp('id').then((id) => {
			if (!id) {
				widget.setProp('id', `jobber-widget-${uuidv4()}`);
			}
		});

		getInstance().then(({ site }) => {
			setDashboardUrl(`https://manage.wix.com/dashboard/${site?.siteId}/${pageMetadata.id}`);
		});
	}, []);

	const selectedForm = useMemo(
		() => forms.find((form) => form.id === formId) ?? null,
		[forms, formId],
	);

	const needsRepick = propsLoaded && !formId && !!legacyFormType;
	const selectionMissing = propsLoaded && !!formId && forms.length > 0 && !selectedForm;

	const selectForm = useCallback(async (form: JobberForm) => {
		setStoreError(null);
		const stored = await storeForm(form);
		if (!stored) {
			setStoreError("This form's content could not be loaded. Please try again.");
			return;
		}
		setFormId(form.id);
	}, []);

	// A brand new widget starts from the account's default form. A widget saved in the
	// old shape is left alone, so a live page never changes form without the owner choosing.
	useEffect(() => {
		if (!propsLoaded || formId || legacyFormType || forms.length === 0) {
			return;
		}
		const preferred = forms.find((form) => form.default) ?? forms[0];
		selectForm(preferred);
	}, [propsLoaded, formId, legacyFormType, forms, selectForm]);

	// The saved form was turned off or deleted in Jobber. Switch the widget to the account
	// default, so visitors see a working form rather than Jobber's "form not found" page.
	useEffect(() => {
		if (!selectionMissing) {
			return;
		}
		const defaultForm = forms.find((form) => form.default);
		if (defaultForm) {
			selectForm(defaultForm).then(() => setFellBackToDefault(true));
		}
	}, [selectionMissing, forms, selectForm]);

	// Refresh the stored copy each time the panel opens, so edits made to the form in
	// Jobber reach the live widget. Without this the widget keeps its original snapshot.
	useEffect(() => {
		if (selectedForm) {
			storeForm(selectedForm);
		}
	}, [selectedForm]);

	const options = useMemo(
		() =>
			forms.map((form) => ({
				id: form.id,
				value: form.default ? `${form.name} (default)` : form.name,
			})),
		[forms],
	);

	const handleFormChange = useCallback(
		(option: DropdownLayoutValueOption) => {
			const form = forms.find((item) => item.id === option.id.toString());
			if (form) {
				selectForm(form);
			}
		},
		[forms, selectForm],
	);

	const handleNavigateToDashboard = useCallback(() => {
		if (dashboardUrl) {
			setIsNavigating(true);
			if (window.top) {
				window.top.location.href = dashboardUrl;
			} else {
				window.location.href = dashboardUrl;
			}
		}
	}, [dashboardUrl]);

	const notice = (() => {
		if (storeError) {
			return storeError;
		}
		if (needsRepick) {
			return [
				'This widget was set up with an older version of the Jobber app. The form still works on your site.',
				'Forms are now listed by the names they have in Jobber, and you can build your own. Find and create forms in Jobber under Settings, Requests and Bookings, then select one from the Form list.',
				'If you do nothing, this widget keeps showing the same form.',
			].join('\n\n');
		}
		if (fellBackToDefault) {
			return 'The selected form is no longer available, so visitors now see your default form. Choose another form if you prefer.';
		}
		if (selectionMissing) {
			return 'The selected form is no longer available. Choose another form.';
		}
		return null;
	})();

	const renderBody = () => {
		if (error?.cause === 'not-connected') {
			return (
				<Box direction="vertical" gap="12px" align="center">
					<Text size="small" weight="normal" align="center">
						Your Wix site isn&apos;t connected to Jobber. Click &apos;Go to
						Dashboard&apos; to connect your Jobber account, or click the
						&apos;Manage&apos; button on this widget.
					</Text>
					<Button
						priority="primary"
						onClick={handleNavigateToDashboard}
						disabled={!dashboardUrl || isNavigating}
					>
						{isNavigating ? 'Opening Dashboard...' : 'Go to Dashboard'}
					</Button>
				</Box>
			);
		}

		if (!isLoading && !error && forms.length === 0) {
			return (
				<Text size="small" weight="normal">
					No enabled forms were found on your Jobber account. Create or enable a form in
					Jobber, then reopen these settings.
				</Text>
			);
		}

		return (
			<FormField label="Form">
				<Dropdown
					selectedId={selectedForm?.id ?? undefined}
					options={options}
					onSelect={handleFormChange}
					aria-label="Form"
					placeholder="Select a form to display"
				/>
			</FormField>
		);
	};

	return (
		<WixDesignSystemProvider>
			<SidePanel width="300" height="100vh">
				<SidePanel.Content noPadding stretchVertically>
					<SidePanel.Field>{renderBody()}</SidePanel.Field>
				</SidePanel.Content>
				{isLoading || error || notice || selectedForm ? (
					<SidePanel.Footer noPadding>
						<SectionHelper
							fullWidth
							appearance={(error && !isLoading) || notice ? 'warning' : 'success'}
							border="topBottom"
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '8px',
								}}
							>
								{isLoading && <Loader size="tiny" />}
								<Text size="small" weight="normal">
									{isLoading && 'Fetching your Jobber forms...'}
									{!isLoading && error && error.message}
									{!isLoading && !error && notice && (
										<span style={{ whiteSpace: 'pre-line' }}>{notice}</span>
									)}
									{!isLoading &&
										!error &&
										!notice &&
										selectedForm &&
										'Jobber form loaded.'}
								</Text>
							</div>
						</SectionHelper>
					</SidePanel.Footer>
				) : null}
			</SidePanel>
		</WixDesignSystemProvider>
	);
};

export default Panel;
