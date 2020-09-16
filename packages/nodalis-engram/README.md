# nodalis-engram

As it stands, yes this is originally a carbon-copy of Nexus Schema. Despite how convoluted their codebase is, I lack the time to develop a codebase from scratch. Therefore, as it is open-source, I've copied everything to make my own variant that:

- [x] Supports Yarn 2
- [ ] Supports Workspaces with a project-local approach
- [ ] Automatically generates files into `<workspaceLocal>/.engram/`
- [ ] Includes built-in database connection derived from Prisma, also into `<workspaceLocal>/.engram/`

## About

[Apollo](https://www.apollographql.com/)-based and built on top of [Schema](https://nexusjs.org/), Engram allows you to build your schemas code-first with a focus on Apollo's standards and features!
