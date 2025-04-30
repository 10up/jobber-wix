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

export async function GET(req: Request) {
	console.log('Log from GET.');
	return new Response('Response from GET.');
}

export async function POST(req: Request) {
	console.log('Log from POST.');
	return Response.json({ success: true });
}
