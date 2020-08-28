import { EOL } from 'os';
import * as path from 'path';
import * as ts from 'typescript';

function compile(tsConfigPath: string, folder?: any, ...opts: string[]) {
  const emitDeclarationOnly = opts.includes('--emitDeclarationOnly');
  const parsedConfig = ts.parseJsonConfigFileContent(
    {
      extends: tsConfigPath,
      compilerOptions: {
        rootDir: 'sources',
        outDir: 'lib',
        emitDeclarationOnly,
      },
      include: ['sources/**/*.ts'],
    },
    ts.sys,
    folder
  );

  const program = ts.createProgram({
    options: parsedConfig.options,
    rootNames: parsedConfig.fileNames,
    configFileParsingDiagnostics: parsedConfig.errors,
  });

  const diagnostics = program.emit();

  return reportErrors(diagnostics.diagnostics);
}

function reportErrors(allDiagnostics: readonly ts.Diagnostic[]): 0 | 1 {
  const errorsAndWarnings = allDiagnostics.filter((d) => {
    return d.category !== ts.DiagnosticCategory.Message;
  });

  if (errorsAndWarnings.length === 0) return 0;

  const formatDiagnosticsHost = {
    getCurrentDirectory: () => path.dirname(__dirname),
    getCanonicalFileName: (fileName: string) => fileName,
    getNewLine: () => EOL,
  };

  for (const errorAndWarning of errorsAndWarnings) {
    console.error(ts.formatDiagnostic(errorAndWarning, formatDiagnosticsHost));
  }

  return 1;
}

process.exitCode = compile(
  path.resolve(__dirname, `../tsconfig.json`),
  ...process.argv.slice(2)
);
