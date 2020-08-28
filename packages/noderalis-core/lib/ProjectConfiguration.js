"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectConfiguration = void 0;
const fs_1 = __importDefault(require("fs"));
const module_1 = require("module");
const path_1 = __importDefault(require("path"));
const AbstractConfiguration_1 = require("./AbstractConfiguration");
// Dangerously setup our resolver
const requireAbs = (module_1.createRequire || module_1.createRequireFromPath)(path_1.default.resolve(__dirname, './index.ts'));
class ProjectConfiguration extends AbstractConfiguration_1.AbstractConfiguration {
    constructor(startingCwd) {
        super();
        this.cwd = startingCwd;
    }
    /**
     * Creates a the Noderalis configuration. Called from within `.noderalis.ts` only.
     * @param config
     */
    static async create(config) {
        ProjectConfiguration.config = config;
        console.log('Successfully created something');
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
     * Attempts tp find a workspace from the `workspaces` setting in the root
     * `package.json` and return it's absolute path.
     *
     * - `pkg.workspaces` must exist
     * - `pkg.main` must point to the workspace entry file
     *   - ie `"main": "./sources/index.ts"`
     */
    static async workspace(workspaceName) {
        console.log('workspace');
        const rootDir = await this.findProjectCwd(process.cwd(), true);
        let currentCwd = process.cwd();
        if (rootDir == null) {
            throw new Error('Not a project!');
        }
        const data = fs_1.default.readFileSync(path_1.default.resolve(rootDir, 'package.json'), {
            encoding: 'utf-8',
        });
        return new Promise(async (resolve, reject) => {
            const parsedPkg = JSON.parse(data);
            if (!parsedPkg.workspaces) {
                throw new Error('package.json must include a workspaces setting.');
            }
            parsedPkg.workspaces.forEach((workspaceDir) => {
                if (workspaceDir.includes('*')) {
                    // Get the name of the workspaces folder ie "packages/*" => "packages"
                    const workspace = workspaceDir.slice(0, -2);
                    console.log(`workspace->forEach: ${workspace}`);
                    console.log('1:rootDir ' + path_1.default.join(rootDir, workspace));
                    // Read each workspace
                    fs_1.default.readdir(path_1.default.join(rootDir, workspace), async (err, files) => {
                        console.log('2:rootDir ' + path_1.default.join(rootDir, workspace));
                        if (err)
                            throw console.log(`Error: ${err}. Files: ${files}`);
                        for (let i = 0; i < files.length; i++) {
                            const testDir = path_1.default.join(rootDir, workspace, files[i]);
                            console.log('3:rootDir ' + path_1.default.join(rootDir, workspace, files[i]));
                            currentCwd = testDir;
                            console.log(`package location: ${currentCwd}\\package.json`);
                            console.log(`desired name: ${workspaceName}`);
                            const workspacePkg = await JSON.parse(fs_1.default.readFileSync(`${currentCwd}/package.json`, {
                                encoding: 'utf-8',
                            }));
                            console.log(`package name: ${workspacePkg.name}`);
                            if (workspaceName == workspacePkg.name) {
                                resolve(path_1.default.resolve(currentCwd, workspacePkg.main));
                            }
                        }
                        reject('Not a valid workspace!');
                    });
                }
                else {
                    // check against named workspaces
                    resolve('');
                }
            });
        });
    }
    static async findProjectCwd(startingCwd, noderalis = false) {
        console.log('findProjectCwd');
        let projectCwd = null;
        let nextCwd = startingCwd;
        let currentCwd = null;
        while (nextCwd !== currentCwd) {
            currentCwd = nextCwd;
            if (fs_1.default.existsSync(path_1.default.join(currentCwd, 'package.json'))) {
                console.log('found package: ' + currentCwd);
                projectCwd = currentCwd;
            }
            if (noderalis) {
                if (fs_1.default.existsSync(path_1.default.join(currentCwd, 'noderalis.json'))) {
                    console.log('found noderalis' + currentCwd);
                    projectCwd = currentCwd;
                    break;
                }
            }
            else {
                if (projectCwd !== null) {
                    break;
                }
            }
            nextCwd = path_1.default.dirname(currentCwd);
        }
        return projectCwd;
    }
}
exports.ProjectConfiguration = ProjectConfiguration;
async function testWrkspc() {
    const builder = await ProjectConfiguration.workspace('@noderalis/builder');
    console.log('BuilderLocation: ' + builder);
}
testWrkspc();
