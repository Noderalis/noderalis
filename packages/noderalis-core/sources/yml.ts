import { safeLoad, FAILSAFE_SCHEMA } from 'js-yaml';

export function parseYml(source: string) {
	const yml = safeLoad(source, {
		schema: FAILSAFE_SCHEMA,
	});

	if (yml === undefined || yml === null) return {};

	if (typeof yml !== `object`)
		throw new Error(`Expected an indexed object, got a ${typeof yml} instead.`);

	if (Array.isArray(yml))
		throw new Error(`Expected an indexed object, got an array instead.`);

	return yml;
}
