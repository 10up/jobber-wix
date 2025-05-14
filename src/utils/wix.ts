export function getAppInstanceFromUrl() {
	return new URLSearchParams(window.location.search).get('instance')!;
}
