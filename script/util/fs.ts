import fs from 'fs';
import rootDir from 'toolkit/src/utils/rootDir';

export function dirExists(dir: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    return fs.statSync(rootDir(dir));
  });
}

export function mkdir(dir: string): Promise<void> {
  return new Promise(() => {
    fs.mkdirSync(rootDir(dir), { recursive: true });
  });
}

/** Ignore this, I forgot how to return objects */
export function testr(tst: string): Promise<typeof obj> {
  const obj = {
    status: 202,
    data: {
      response: tst,
    },
  };
  return new Promise((res, rej) => {
    res(obj);
    rej('awe');
  });
}

/** Ignore this, I forgot how to return objects */
// testr('hemllo').then(({ data }) => {
//   console.log(data.response);
// });
