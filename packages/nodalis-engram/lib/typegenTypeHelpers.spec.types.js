"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsd_1 = require("tsd");
const getOnes = () => Promise.resolve([]);
tsd_1.expectAssignable(getOnes().then((ones) => ones));
// object with array
tsd_1.expectAssignable({ a: [1] });
tsd_1.expectAssignable(Promise.resolve({ a: [1] }));
// array
tsd_1.expectAssignable([1]);
tsd_1.expectAssignable(Promise.resolve([1]));
