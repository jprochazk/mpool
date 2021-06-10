# TypeScript Library Template

- TypeScript
- Linting: ESLint
- Testing: Jest
- Build: Rollup (outputs UMD, CJS, and ESM)
- GitHub actions:
  - Automated testing
  - Automated documentation
  - Semi-automated releases
- [src](./src) contains source (`.ts`) and test (`.test.ts`) files

Setup:
- Clone the repo and copy the files over to your project's directory, or create a repository on GitHub using this one as a template
- Publish it onto NPM (you don't need to include any actual library code at this point)
- In the GitHub repository, create a secret called `NPM_TOKEN` which contains an NPM automation token for your package
  - Ensure that your NPM package is set to require 2FA or automation tokens for releases
- Write your code, create tests for it, etc.
- When you're ready to publish:
  - Commit your latest changes
  - Use `npm version` to bump the package version
  - Push to github with `git push --follow-tags`
  - Create a release on GitHub using the tag created by `npm version`
  - Done!