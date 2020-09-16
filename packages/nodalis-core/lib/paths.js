"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findWorkspace = exports.paths = void 0;
const rootDir_1 = __importDefault(require("./rootDir"));
/**
 * Returns the paths to the given files, subjectively knowing which files always
 * exist, such as `tsconfig.json` in the root directory. It will try to resolve
 * more dynamic paths such as user entries and templates such as
 * `<rootDir>/public/index.html`.
 *
 * @todo since we plan on making this dynamic, I hope to implement a
 * dynamic `paths.d.ts` or interface. Idk...
 */
exports.paths = {
    /**
     * Make this dynamic, don't confine us to specific indexes, otherwise
     * we're not really supporting the user's extra files.
     *
     * @todo Smartly look for possible entries and a custom `.toolkit.json`.
     */
    source: {
        /** Toolkit 0.x.x series looks for this specific entry. */
        entry: rootDir_1.default('src/index.ts'),
        root: rootDir_1.default('src'),
    },
    build: {
        /**
         * The output folder, defaults to `dist/` but can be changed via `tsconfig.json`
         * or `<rootDir>/.toolkit.json`.
         */
        root: rootDir_1.default('dist'),
    },
    config: {
        tsconfig: rootDir_1.default('tsconfig.json'),
        root: rootDir_1.default('./'),
    },
};
function findWorkspace(name) {
    if (!name.startsWith('@') && !name.includes('/')) {
        console.error('Not a workspace!');
    }
}
exports.findWorkspace = findWorkspace;
