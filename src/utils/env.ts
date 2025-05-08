export const isDev = () => {
	return import.meta.env.DEV;
};

export const isProd = () => {
	return import.meta.env.PROD;
};

export const isTest = () => {
	return import.meta.env.MODE === 'test';
};
