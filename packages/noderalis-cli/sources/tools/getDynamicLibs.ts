const DYNAMIC_LIBS = [
  `@noderalis/cli`,
  `@noderalis/core`,
];

export const getDynamicLibs = () => {
  return new Map(DYNAMIC_LIBS.map(name => {
    return [name, require(name)];
  }));
};
