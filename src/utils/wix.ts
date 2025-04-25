export function getAppInstance() {
	return new URLSearchParams(window.location.search).get('instance')!;
}
