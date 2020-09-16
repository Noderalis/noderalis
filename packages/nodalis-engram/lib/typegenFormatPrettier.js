"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typegenFormatPrettier = void 0;
const path_1 = __importDefault(require("path"));
// todo use Prettier.Options type instead of just `object`
// but will this force us to make prettier a dep then since that type would be user-visible?
function typegenFormatPrettier(prettierConfig) {
    return async function formatTypegen(content, type) {
        let prettier;
        /* istanbul ignore next */
        try {
            prettier = require('prettier');
        }
        catch (_a) {
            console.warn('It looks like you provided a `prettierConfig` option to GraphQL Engram, but you do not have prettier ' +
                'installed as a dependency in your project. Please add it as a peerDependency of engram to use this feature. ' +
                'Skipping formatting.');
            return content;
        }
        let prettierConfigResolved;
        if (typeof prettierConfig === 'string') {
            /* istanbul ignore if */
            if (!path_1.default.isAbsolute(prettierConfig)) {
                console.error(new Error(`Expected prettierrc path to be absolute, saw ${prettierConfig}. Skipping formatting.`));
                return content;
            }
            prettierConfigResolved = (await prettier.resolveConfig('ignore_this', {
                config: prettierConfig,
            })); // non-null assert b/c config file is explicitly passed
        }
        else {
            prettierConfigResolved = prettierConfig;
        }
        return prettier.format(content, {
            ...prettierConfigResolved,
            parser: type === 'types' ? 'typescript' : 'graphql',
        });
    };
}
exports.typegenFormatPrettier = typegenFormatPrettier;
