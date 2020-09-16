"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootDir = void 0;
const path_1 = require("path");
/**
 * Returns the path of a given file or directory, based on the root directory. If looking
 * for a file in the rootDir, exclude `filename` and use `pathToFile`.
 *
 * @param pathToFile the path to the `filename`.
 * @param filename the name of the file to return.
 */
exports.rootDir = (pathToFile, filename) => {
    // resolve(
    //   __dirname,
    //   '../..',
    //   filename ? `${pathToFile}/${filename}` : pathToFile
    // );
    isCwdRootDir();
    isYarnPnp();
    return path_1.resolve(process.cwd(), filename ? `${pathToFile}/${filename}` : pathToFile);
};
/**
 * Check to make sure we're in the root directory.
 */
const isCwdRootDir = () => {
    // stat(`${process.cwd()}/.yarn/cache/`, (err, stats) => {
    //   if (err) {
    //     console.error("You're not in the root directory!");
    //     // process.exit();
    //   } else if (stats.isDirectory()) {
    //     return true;
    //   }
    //   return true;
    // });
    // return true;
};
/**
 * Make sure Yarn is using Plug'n'Play.
 */
const isYarnPnp = () => {
    // stat(`${process.cwd()}/.pnp.js`, (err, stats) => {
    //   if (err) {
    //     console.error("You're not in the root directory!");
    //     process.exit();
    //   } else if (stats.isFile()) {
    //     return true;
    //   }
    //   return true;
    // });
};
exports.default = exports.rootDir;
