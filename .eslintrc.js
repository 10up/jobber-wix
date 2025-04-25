module.exports = {
	extends: ['@10up/eslint-config/react'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
		project: './tsconfig.json',
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
	rules: {},
};
