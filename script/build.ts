import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import pkg from '../package.json';
import rootDir from 'toolkit/src/utils/rootDir';
import { dirExists } from './util/fs';

try {
  dirExists('dist/').catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
  // dirExists('dist/bin/')
  //   .catch((error) => {
  //     console.error('Creating dist/bin/');

  //     mkdir('dist/bin');
  //   })
  //   .then(() => {
  //     copyFileSync(
  //       rootDir('script/bin/', 'toolkit'),
  //       rootDir('dist/bin/', 'toolkit')
  //     );
  //   });

  copyFileSync(rootDir('README.md'), rootDir('dist/', 'README.md'));

  const file = readFileSync(rootDir('script/release/template.package.json'), {
    encoding: 'utf8',
  });
  const updatedPkg = JSON.parse(file);
  updatedPkg.description = pkg.description;
  updatedPkg.version = pkg.version;
  updatedPkg.author = pkg.author;

  writeFileSync(
    rootDir('dist', 'package.json'),
    JSON.stringify(updatedPkg, null, 2)
  );
} catch (error) {
  console.error(error);
}
