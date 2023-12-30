# rust-lib

Our resource-heavy library code and library code with strict performance requirements is written in Rust. This is the place where we put all of that code.

rust-lib uses [Neon bindings](https://neon-bindings.com/) (not to get confused with [Neon, the serverless postgres provider](https://neon.tech/)) to embed Rust code into Node.js.

To build + use, run `npm run build:rust` from the root package.json.