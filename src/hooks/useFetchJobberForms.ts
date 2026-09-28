import useSWR, { mutate } from 'swr';
import { httpClient } from '@wix/essentials';

import { getMiddlewareUrl } from '../utils/api';

/**
 * The form types a widget could be saved with before forms were listed per account.
 * Kept only so widgets saved in that shape can still be recognised.
 */
export type FormType = 'request' | 'booking';

export type EmbedObject = {
	markup: string;
	scripts: Array<{
		attributes: Record<string, string>;
		content: string;
	}>;
};

/**
 * What a Jobber form creates when submitted: a request only, a job, or a request with an assessment.
 */
export type JobberFormBookingType = 'NONE' | 'JOB' | 'ASSESSMENT';

/**
 * A form from the account's form list, with its embed processed for the shadow DOM.
 */
export type JobberForm = {
	id: string;
	name: string;
	default: boolean;
	bookingType: JobberFormBookingType;
	embedScript: string;
	url: string;
	embedUrl: string;
	inline: EmbedObject;
};

const FORMS_KEY = 'jobber-forms';

/**
 * Fetch every enabled form on the connected Jobber account.
 *
 * The widget renders inside a shadow DOM, so each form comes back with its
 * embed script already processed into markup and inline script contents.
 *
 * @returns {Promise<JobberForm[]>} The account's forms
 */
async function fetchJobberForms(): Promise<JobberForm[]> {
	const res = await httpClient.fetchWithAuth(`${getMiddlewareUrl()}/jobber/forms?output=inline`, {
		headers: {
			'x-jobber-integration': 'wix',
		},
	});
	const data = await res.json();

	if (data.error) {
		if (
			data.error.includes('Invalid Token') ||
			data.error.includes('Failed to make request to Jobber API')
		) {
			throw new Error(`Your site is not connected to Jobber.`, { cause: 'not-connected' });
		}
		throw new Error(data.error);
	}

	if (!Array.isArray(data.forms)) {
		throw new Error(
			'Error fetching forms. Please try again or check your connection to Jobber.',
		);
	}

	return data.forms;
}

/**
 * The connected account's forms, fetched once per panel session.
 *
 * @returns The forms, loading and error state, and a refetch function
 */
export function useJobberForms() {
	const { data, error, isLoading, isValidating } = useSWR<JobberForm[]>(
		FORMS_KEY,
		fetchJobberForms,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			revalidateIfStale: false,
			shouldRetryOnError: false,
		},
	);

	const refetch = () => {
		mutate(FORMS_KEY);
	};

	return {
		forms: data ?? [],
		isLoading: isLoading || isValidating,
		error,
		refetch,
	};
}
