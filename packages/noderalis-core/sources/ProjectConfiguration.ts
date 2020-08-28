import FS from "fs";
import { createRequire, createRequireFromPath } from "module";
import Path from "path";
import { AbstractConfiguration } from "./AbstractConfiguration";
import { NoderalisConfig } from "./NoderalisConfig";

// Dangerously setup our resolver
const requireAbs = (createRequire || createRequireFromPath)(
  Path.resolve(__dirname, "./index.ts")
);

export class ProjectConfiguration extends AbstractConfiguration {
  static cwd: string;
  cwd: string;
  static config: NoderalisConfig;

  constructor(startingCwd: string) {
    super();
    this.cwd = startingCwd;
  }

  static async find() {
    this.requireConfig();
  }

  static async requireConfig() {
    const rootDir = await this.findProjectCwd(process.cwd(), true);
    let reqConfig = requireAbs(`${rootDir}\\noderalis.json`);

    if (reqConfig.default) {
      reqConfig = reqConfig.default;
    }

    return reqConfig;
  }

  /**
   * Returns an absolute path from within a specified workspace to a specified path.
   * If using a root related path, use `resolveProjectRoot` instead.
   * @param workspace the workspace, as defined in `<rootDir>/package.json`, to look for.
   * @param desiredPath the path or file we're looking for.
   * @param filename the optional file we're looking for.
   */
  static async resolveProjectWorkspace(
    workspace: string,
    desiredPath: string,
    filename?: string
  ): Promise<string> {
    const ws = await this.workspace(workspace, true);
    const resolvedPath = Path.resolve(
      ws,
      filename ? `${desiredPath}/${filename}` : desiredPath
    );
    try {
      if (desiredPath == "lib") {
        FS.access(resolvedPath, FS.constants.F_OK, (err) => {
          console.log(err);

          if (err) {
            FS.mkdirSync(resolvedPath);
            return resolvedPath;
          } else {
            FS.accessSync(resolvedPath, FS.constants.F_OK);
            return resolvedPath;
          }
        });
        return resolvedPath;
      } else {
        FS.accessSync(resolvedPath, FS.constants.F_OK);
        return resolvedPath;
      }
    } catch (err) {
      throw `Path "${resolvedPath}" does not exist!`;
    }
  }

  /**
   * Returns an absolute path from the `<rootDir>` to the desired path.
   * If using a workspace related path, use `resolveProjectWorkspace` instead.
   * @param desiredPath the path or root file we're looking for.
   * @param filename the file we're looking for.
   */
  static async resolveProjectRoot(
    desiredPath: string,
    filename?: string
  ): Promise<string> {
    const root = await this.findProjectCwd(process.cwd(), true);
    const resolvedPath = Path.resolve(
      root,
      filename ? `${desiredPath}/${filename}` : desiredPath
    );

    // Make sure it exists
    try {
      FS.accessSync(resolvedPath, FS.constants.F_OK);
      return resolvedPath;
    } catch (err) {
      throw `Path "${resolvedPath}" does not exist!`;
    }
  }

  /**
   * Attempts tp find a workspace from the `workspaces` setting in the root
   * `package.json` and return it's absolute path.
   *
   * - `pkg.workspaces` must exist
   * - `pkg.main` must point to the workspace entry file
   *   - i.e. `"main": "./sources/index.ts"`
   */
  static async workspace(
    workspaceName: string,
    returnWorkspacePath?: boolean
  ): Promise<string> {
    const rootDir = await this.findProjectCwd(process.cwd(), true);
    let currentCwd = process.cwd();

    const data = FS.readFileSync(Path.resolve(rootDir, "package.json"), {
      encoding: "utf-8",
    });

    return new Promise(async (resolve, reject) => {
      const parsedPkg: { workspaces?: string[] } = JSON.parse(data);

      if (!parsedPkg.workspaces) {
        throw new Error("package.json must include a workspaces setting.");
      }

      parsedPkg.workspaces.forEach((workspaceDir) => {
        if (workspaceDir.includes("*")) {
          // Get the name of the workspaces folder i.e. "packages/*" => "packages"
          const workspace = workspaceDir.slice(0, -2);

          // Read each workspace
          FS.readdir(Path.join(rootDir, workspace), async (err, files) => {
            if (err) throw console.log(`Error: ${err}. Files: ${files}`);

            for (let i = 0; i < files.length; i++) {
              const testDir = Path.join(rootDir, workspace, files[i]);

              currentCwd = testDir;

              const workspacePkg: {
                name: string;
                main: string;
              } = await JSON.parse(
                FS.readFileSync(`${currentCwd}/package.json`, {
                  encoding: "utf-8",
                })
              );

              if (workspaceName == workspacePkg.name) {
                if (returnWorkspacePath) resolve(Path.resolve(currentCwd));
                else resolve(Path.resolve(currentCwd, workspacePkg.main));
              }
            }

            reject("Not a valid workspace!");
          });
        } else {
          // check against named workspaces
          resolve("");
        }
      });
    });
  }

  /**
   * Returns the root path or relative project path.
   * @param startingCwd the directory to start with, safely pass `process.cwd()` when possible.
   * @param noderalis search for the root directory.
   */
  static async findProjectCwd(
    startingCwd: string,
    noderalis: boolean = false
  ): Promise<string> {
    let projectCwd: string = "";
    let nextCwd = startingCwd;
    let currentCwd: string = "";

    while (nextCwd !== currentCwd) {
      currentCwd = nextCwd;

      if (FS.existsSync(Path.join(currentCwd, "package.json"))) {
        projectCwd = currentCwd;
      }

      if (noderalis) {
        if (FS.existsSync(Path.join(currentCwd, "noderalis.json"))) {
          projectCwd = currentCwd;
          break;
        }
      } else {
        if (projectCwd !== "") {
          break;
        }
      }

      nextCwd = Path.dirname(currentCwd);
    }

    return projectCwd;
  }
}

async function testResolveProjectWorkspace() {
  const builder = await ProjectConfiguration.resolveProjectWorkspace(
    "@noderalis/core",
    "lib"
  );
  console.log("BuilderLocation: " + builder);
}

testResolveProjectWorkspace().catch((err) => {
  console.error(err);
});
