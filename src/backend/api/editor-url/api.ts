import { editor } from '@wix/urls';

export async function GET() {
	const response = await editor.getEditorUrls();

	return Response.json(response);
}
