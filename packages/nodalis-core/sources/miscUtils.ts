import { UsageError } from 'clipanion';

export function prettifySyncErrors<T>(
	fn: () => T,
	update: (message: string) => string
) {
	try {
		return fn();
	} catch (error) {
		error.message = update(error.message);
		throw error;
	}
}

export function replaceEnvVariables(
	value: string,
	{ env }: { env: { [key: string]: string | undefined } }
) {
	const regex = /\${(?<variableName>[\d\w_]+)(?<colon>:)?-?(?<fallback>[^}]+)?}/g;

	return value.replace(regex, (...args) => {
		const { variableName, colon, fallback } = args[args.length - 1];

		const variableExist = Object.prototype.hasOwnProperty.call(
			env,
			variableName
		);
		const variableValue = env[variableName];

		if (variableValue) return variableValue;
		if (variableExist && !variableValue && colon) return fallback;
		if (variableExist) return variableValue;
		if (fallback) return fallback;

		throw new UsageError(`Environment variable not found (${variableName})`);
	});
}
