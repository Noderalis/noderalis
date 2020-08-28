"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.identity = exports.notImpl = exports.env = void 0;
const chalk_1 = __importDefault(require("chalk"));
exports.env = {
    /** Are we running in `development`? */
    isDevelopment: process.env.BUILD_ENV == 'development',
    /** Are we running in `production`? */
    isProduction: process.env.BUILD_ENV == 'production',
};
exports.notImpl = chalk_1.default `Not Yet Implemented. Expected by {cyan v1.0.0}`;
exports.identity = (value) => value;
