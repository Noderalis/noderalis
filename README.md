# Nodalis "⋂"

> All wikis and READMEs have moved to using [Notion](https://notion.so)! You can find our docs [here](https://www.notion.so/blackfall/Noderalis-495041d5d60a4c0b9375d8c94f066857).

> <br/>
> ⚠ Bug Report ⚠ <br/>
> When spawning a Nodalis instance within WSL, accidental disconnects will not kill the server. You must use `sudo kill <PID>` to effectively kill all rogue nodejs processes. <br/>
> Do not use `sudo killall node` or you might as well restart your host machine, as VS Code Remote - WSL will reconnect lagging and pinging missing processes.
> <br/><br/>

[![](https://img.shields.io/badge/developed%20with-Yarn%202-blue)](https://github.com/yarnpkg/berry)

## Operability

Following the `.noderals.ts` and programmatic `webpack` nightmare, Nodalis explicitly requires a few ground rules in order to operate correctly.

- When using workspaces, define them with either `directory/*` or `directory/workspace`
- When using workspaces, each workspace `package.json` must include a `main` field which points to the entry of your workspace. Ie: `./sources/index.ts`, `./sources/main.ts`.
- A `.nodalis.yml`, must be located in the root directory.

### Internals

Again learning from the old implementation, Nodalis has been stripped of a lot of overhead logic and modules, using a temporary webpack implementation. Nodalis is capably of self-resolving the workspaces, their entries, and the project root. These methods are exported for external use programmatically, unlike Yarn.

The idea is for Nodalis to determine what files are being used, and then generate a final webpack configuration and write it to the disk, which cross-spawn will then call webpack and point it to the configuration. Nodalis will eventually have a `@nodalis/builder` to handle this programmatically again when I figure out the correct logic.

Note: attempt to exclude the workspace and instead build it with typescript, using that builder to build the other workspaces. This may be the only good approach. The cost is another library.

### `.nodalis.yml`

This is the configuration which let's nodalis know this is a Nodalis project. Every command will attempt to find this file at runtime. It should be noted, that although a Nodalis config can be placed and used in a non-nodalis project, things may work but to unknown degrees of success.

#### `exclude`

#### `display`

## Naming

Following the standard model that services like Gatsby and Webpack use, `nodalis-<category>-<subcategory?|name>-<name?>` will be the new naming scheme.

### `nodalis-scaffold-<name>`

A scaffold is a major implementation of a service or tool. These are extensive and because of this they follow the opinionated approach. These strictly use Webpack, for now. For example `nodalis-scaffold-apollo` would supply an extensive Apollo application, and if you know about Apollo then you know it uses GraphQL. These scaffolds offer a developer to get started with minimal alterations to the setup. Another example, `nodalis-scaffold-electron` would expand on the Electron Starter, meaning while the Electron Starter may offer a simple demo application, the Electron Scaffold would offer a complex application setup alongside an opinionated auto-update server (built in-house).

### `nodalis-starter-<name>`

> If it's needed, and is definitely a dependency, it's easily a starter.

A Starter is an implementation that expands a seed. For example `nodalis-starter-express` would supply the basics for using Express, and `nodalis-starter-react` would supply the foundations for using react.

### `nodalis-seed-<name>`

> If it's needed, but considered a devDependency, it's easily a seed.

A Seed holds nothing more than tools and configs. There aren't meant to be many of these, but they can be useful. For example `nodalis-seed-workspaces` would provide a workspaces setup, and `workspaces-eslint` would provide the workspaces setup with added linting using ESLint and Prettier.

## Commands

### `build`

Builds all entries in `.nodalis.ts`, if workspaces are detected, each workspace is built in parallel. If you have multiple entries but not workspaces, you can force parallelism with `--parallel`

- `mode, m`
  - development (default) : build in development, source-maps, inline assets
  - production : build in production, minify, uglify, output assets
- `parallel, p` : force building entries in parallel

### `start`

Starts a development server when applicable. If a server is not setup, will return a Usage Error.

### `test`

Runs all tests using Jest.

### `lint`

Runs ESLint and attempts to automatically fix problems.

### `new <project-name> <scaffold-name>`

Generates a new project from a scaffold available from the Nodalis repository.
