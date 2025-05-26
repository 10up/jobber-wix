import useSWR, { mutate } from 'swr';
import { httpClient } from '@wix/essentials';
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
	const { site } = await getInstance();
	const res = await httpClient.fetchWithAuth(
		`${getMiddlewareUrl()}/jobber/?clientUrl=${site?.siteId!}&query=${formType}&output=inline`,
		{
			headers: {
				'x-jobber-integration': 'wix',
			},
		},
	);
	const data = await res.json();

	if (data.error) {
		if (data.error.includes('Invalid Token')) {
			throw new Error(
				'Your site is not connected to jobber. Go to Jobber Dashboard page to connect your wix site to Jobber',
			);
		}
		throw new Error(data.error);
	}
	if (!data.markup) {
		throw new Error(
			'Error fetching form. Please try again or check your connection to Jobber.',
		);
	}
	return data;
}

export function useFetchJobberForms({ formType }: UseFetchJobberFormsProps) {
	const { data, error, isLoading, isValidating } = useSWR<EmbedObject>(
		formType,
		fetchJobberForm,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			revalidateIfStale: false,
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
