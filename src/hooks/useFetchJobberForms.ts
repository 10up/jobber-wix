import useSWR, { mutate } from 'swr';
import { httpClient } from '@wix/essentials';
import { getMiddlewareUrl } from '../utils/api';

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
	const res = await httpClient.fetchWithAuth(
		`${getMiddlewareUrl()}/jobber/?query=${formType}&output=inline`,
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
				'Your site is not connected to Jobber. Go to the Jobber Dashboard page to connect your Wix site to Jobber',
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
		formType ?? null,
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
		embedScript: data ?? null,
		isLoading: isLoading || isValidating,
		error,
		refetch,
	};
}
