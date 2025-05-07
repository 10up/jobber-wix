export function getAppInstanceIdFromUrl() {
	return new URLSearchParams(window.location.search).get('instance')!;
}
