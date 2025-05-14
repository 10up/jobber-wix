import useSWR, { mutate } from 'swr';
import { createClient } from '@wix/sdk';
import { editor, widget } from '@wix/editor';
import { getMiddlewareUrl } from '../utils/api';
import { getInstance } from '../backend/get-instance.web';

export type FormType = 'request' | 'booking';

export type EmbedObject = {
	markup: string;
	scripts: Array<{
		attributes: Record<string, string>;
		content: string;
	}>;
};

type UseFetchJobberFormsProps = {
	formType: FormType | null;
};

async function fetchJobberForm(formType: FormType): Promise<EmbedObject> {
	const client = createClient({
		host: editor.host(),
		auth: editor.auth(),
		modules: {
			widget,
		},
	});
	const { site } = await getInstance();
	const res = await client.fetchWithAuth(
		`${getMiddlewareUrl()}/jobber/?clientUrl=${site?.siteId!}&query=${formType}&output=inline`,
		{
			headers: {
				'x-jobber-integration': 'wix',
			},
		},
	);
	const data = await res.json();
	if (!data.markup) {
		throw new Error('No embed script found');
	}
	return data;
}

export function useFetchJobberForms({ formType }: UseFetchJobberFormsProps) {
	const { data, error, isLoading, isValidating } = useSWR<EmbedObject>(
		formType,
		fetchJobberForm,
		{
			revalidateOnFocus: false,
			shouldRetryOnError: false,
		},
	);

	const refetch = () => {
		mutate(formType);
	};

	return {
		embedScript: data ?? { markup: '', scripts: [] },
		isLoading: isLoading || isValidating,
		error,
		refetch,
	};
}
