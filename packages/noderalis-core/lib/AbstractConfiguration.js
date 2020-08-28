"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractConfiguration = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class AbstractConfiguration {
    identity(value) {
        return value;
    }
    findConfig(config) {
        return config;
    }
    findProjectCwd(startingCwd) {
        let projectCwd = null;
        let nextCwd = startingCwd;
        let currentCwd = null;
        while (nextCwd !== currentCwd) {
            currentCwd = nextCwd;
            if (fs_1.default.existsSync(path_1.default.join(currentCwd, 'package.json'))) {
                console.log(`Found package!`);
                projectCwd = currentCwd;
            }
            if (fs_1.default.existsSync(path_1.default.join(currentCwd, '.noderalis.ts'))) {
                console.log(`Found config!`);
                projectCwd = currentCwd;
                break;
            }
            if (projectCwd !== null) {
                break;
            }
            nextCwd = path_1.default.dirname(currentCwd);
        }
        return projectCwd;
    }
}
exports.AbstractConfiguration = AbstractConfiguration;
