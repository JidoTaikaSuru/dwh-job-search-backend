// This is a bridge between the Rust code and the TS code.
// We import the Rust code as a NodeJS module, and then export it as a JS function.
// Note that we need to use the `createRequire` function to import the module, since it
// is binary code. If we used `import` instead, it would be interpreted as a JS module, and
// we would get an error becaues it would try to parse it as JS
// Source: https://github.com/farcasterxyz/hub-monorepo/blob/eba02bd9e2b71b5216d6023203363e85b85350f3/apps/hubble/src/rustfunctions.ts#L8
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
export const rustLib = require("./rust-lib/index.node");
// console.log(rustLib)
