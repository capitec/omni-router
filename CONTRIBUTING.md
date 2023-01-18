### Contributing

We value and encourage community contributions.

To get started, here's a few important guidelines we would like you to follow:

1. [Code of Conduct](#1-code-of-conduct)
2. [Issues](#2-issues)
3. [Vulnerabilities](#3-vulnerabilities)
4. [Development](#4-development)
5. [Pull Requests](#5-pull-requests)

## 1. Code of Conduct

Please read and follow our [Code of Conduct](https://github.com/capitec/omni-router/blob/develop/CODE_OF_CONDUCT.md).

## 2. Issues

Engagement always starts with an Issue where conversations and debates can occur around [bugs](#bugs) and [feature requests](#feature-requests):

- ✅ **Do** search for a similar / existing Issue prior to submitting a new one.
- ❌ **Do not** use issues for any personal support. Use [Discussions](https://github.com/capitec/omni-router/discussions) or [StackOverflow](https://stackoverflow.com/) instead.
- ❌ **Do not** side-track or derail issues threads. Stick to the topic please.
- ❌ **Do not** post comments using just "+1", "++" or "👍". Use [Reactions](https://github.blog/2016-03-10-add-reactions-to-pull-requests-issues-and-comments/) instead.

<h3 id="bugs">👾 Bugs</h3>

A bug is an error, flaw or fault associated with *any part* of the project:

- ✅ **Do** search for a similar / existing Issue prior to submitting a new one.
- ✅ **Do** describe the bug concisely, **avoid** adding extraneous code, logs or screenshots.
- ✅ **Do** attach a minimal test or repo (e.g. [CodePen](https://codepen.io/), [jsFiddle](https://jsfiddle.net/)) to demonstrate the bug.

<h3 id="feature-requests">💡 Feature Requests</h3>

A feature request is an improvement or new capability associated with *any part* of the project:

- ✅ **Do** search for a similar / existing Issue prior to submitting a new one.
- ✅ **Do** provide sufficient motivation / use case(s) for the feature. 
- ❌ **Do not** submit multiple unrelated requests within one request.

> **TIP:** We suggest that you engage as much as possible within an Issue prior to proceeding with any contributions.

## 3. Vulnerabilities

A vulnerability is typically a security-related risk associated with *any part* of the project (or any dependencies):

- ✅ **Do** refer to our [Security Policy](https://github.com/capitec/omni-router/security/policy) for more info.
- ✅ **Do** report vulnerabilities via this [link](https://github.com/capitec/omni-router/security/advisories/new). 
- ❌ **Do not** report any Issues or mention in public Discussions for discretionary purposes.

## 4. Development

<h3 id="branches">🌱 Branches</h3>

* `develop` - Default branch for all Pull Requests.
* `main` - Stable branch for all periodic releases.

<h3 id="dependencies">🔒 Dependencies</h3>

* Git (v2+)
* Node.js (v16+)
* NPM (v7+)
* VS Code + recommended extensions (recommended, but not required).

<h3 id="project-setup">📦 Project Setup</h3>

1. [Fork](https://github.com/capitec/omni-router/fork) the repository and create a branch from `develop`.
2. Clone the forked repo, checkout your branch, and run `npm ci` inside the repository root.
3. Start up the dev server with `npm run serve` (or by launching debugging in VS Code).

<h3 id="directory-structure">📂 Directory Structure</h3>

When contributing to the library, please note the following key files and directories:

```
├── src
│   ├── index.ts
│   ├── Router.ts
│   ├── RouterOutlet.ts
│   ├── types.ts
│   ├── ...
```

* `src` - Contains all source file in a flat structure. Contents:
  * `index.ts` - The library index, containing all library exports.
  * `Router.ts` - The main router logic implementation and interface.
  * `RouterOutlet.ts` - The web component in which route pages are rendered.
  * `types.ts` - The public types used in the library.

<h3 id="naming-conventions">🏷 Naming Conventions</h3>

- ✅ **Do** use *lower case* [kebab-case](https://en.wikipedia.org/wiki/Letter_case#Kebab_case) for module file and folder names, e.g. `my-utils.ts`. 🍢
- ✅ **Do** use uppercase first letter [CamelCase](https://en.wikipedia.org/wiki/Camel_case) for class file names, e.g. `MyClass.ts`.
- ✅ **Do** match a class name with its file name, e.g. `MyClass.ts` contains `export class MyClass { ... }`.
- ✅ **Do** prefix the custom element name with `omni-`.
- ❌ **Do not** use any verbs or prefixes within property names, instead **do** use nouns, e.g. `mode`, `position`.
- ✅ **Do** name CSS custom properties as follows: 
  * Component: `--omni-<component>-<state>-<css-property>`, e.g. `--omni-button-primary-background-color`
  * Theme: `--omni-theme-<state>-<css-property>`, e.g. `--omni-theme-primary-color`
- ✅ **Do** follow standard [TypeScript](https://www.typescriptlang.org/docs/), [Lit](https://lit.dev/docs/) related conventions. 

> **TIP:** Refer to existing components and stories for examples. 

<h3 id="defintion-of-done">🎯 Definition of Done</h3>

Here's a *non-exhaustive* list of requirements that are key to contributing to this project.

- ✅ **Do** use [TypeScript](https://www.typescriptlang.org/docs/), with common language practices.
- ✅ **Do** follow our [naming conventions](#naming-conventions).

## 5. Pull Requests

- ✅ **Do** ensure the branch is up to date with the `develop` branch.
- ✅ **Do** ensure there's no conflicts with the `develop` branch.
- ✅ **Do** ensure that all automatic [checks](#checks) pass. ✔