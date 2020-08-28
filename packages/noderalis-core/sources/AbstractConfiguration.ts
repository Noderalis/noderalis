import fs from 'fs';
import path from 'path';

export abstract class AbstractConfiguration {
  protected identity<T>(value: T): T {
    return value;
  }

  protected findConfig(config: string): string {
    return config;
  }

  protected findProjectCwd(startingCwd: string): string {
    let projectCwd: string | null = null;
    let nextCwd = startingCwd;
    let currentCwd: string | null = null;

    while (nextCwd !== currentCwd) {
      currentCwd = nextCwd;

      if (fs.existsSync(path.join(currentCwd, 'package.json'))) {
        console.log(`Found package!`);

        projectCwd = currentCwd;
      }

      if (fs.existsSync(path.join(currentCwd, '.noderalis.ts'))) {
        console.log(`Found config!`);

        projectCwd = currentCwd;
        break;
      }

      if (projectCwd !== null) {
        break;
      }

      nextCwd = path.dirname(currentCwd!);
    }

    return projectCwd!;
  }
}
