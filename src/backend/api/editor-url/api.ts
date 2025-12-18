import { editor } from '@wix/urls';

export async function GET() {
	try {
		const response = await editor.getEditorUrls();
		return Response.json(response);
	} catch (error) {
		console.error(error);
		return Response.json({ error: 'Failed to get editor urls' }, { status: 500 });
	}
}
