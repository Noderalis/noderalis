const DYNAMIC_LIBS = [`@nodalis/cli`, `@nodalis/core`];

export const getDynamicLibs = () => {
	return new Map(
		DYNAMIC_LIBS.map((name) => {
			return [name, require(name)];
		})
	);
};
