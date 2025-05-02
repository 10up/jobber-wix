/**
This file allows you to call backend APIs from your frontend of this app.
You can generate various API methods including GET, POST, PUT, and DELETE.
To learn more, check out our documentation: https://wix.to/Iabrrso
 
Here's how you can call your API from your frontend code:
 
import { httpClient } from '@wix/essentials';
 
function MyComponent() {
  const callMyBackend = async () => {
    const res = await httpClient.fetchWithAuth(`${import.meta.env.BASE_API_URL}/token`);
    console.log(await res.text());
  };
 
  return <button onClick={callMyBackend}>Call backend GET function</button>;
};
 */

import { auth } from '@wix/essentials';

export async function GET(req: Request) {
	return new Response('Response from GET.');
}

export async function POST(req: Request) {
	try {
		const token = await auth.getTokenInfo();

		return Response.json({ success: token.active });
	} catch (error) {
		console.error('Error in POST:', error);
		return Response.json(
			{ success: false, error: 'Failed to get token info' },
			{ status: 500 },
		);
	}
}
