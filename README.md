[![build-test](https://github.com/aykborstelmann/gh-issue-changelog/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/aykborstelmann/gh-issue-changelog/actions/workflows/test.yml)

# Build changelog from mentioned issues in commits

This action can be used to create a changelog from issues mentioned in the commit history. The relevant commits are
those between (including) the last two tags.

## Usage

Example usage
```yaml
jobs:
  build: # make sure build/ci work properly
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: |
          npm install
      - run: |
          npm run all
  test: # make sure the action works on a clean machine without building
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Changelog
        id: changelog
        uses: aykborstelmann/gh-issue-changelog@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: Create Release
          uses: softprops/action-gh-release@v1
          with:
            body: ${{steps.changelog.outputs.changelog}}
          env:
            GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
# Development 
## Code in Main

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

Install the dependencies

```bash
$ npm install
```

Build the typescript and package it for distribution

```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:

```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```

## Change action.yml

The action.yml contains defines the inputs and output for your action.

Update the action.yml with your name, description, inputs and outputs for your action.

See the [documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)

## Change the Code

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

```javascript
import * as core from '@actions/core';

...

async function run() {
    try {
    ...
    } catch (error) {
        core.setFailed(error.message);
    }
}

run()
```

See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various
packages.

## Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder.

Then run [ncc](https://github.com/zeit/ncc) and push the results:

```bash
$ npm run package
$ git add dist
$ git commit -a -m "prod dependencies"
$ git push origin releases/v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node
modules used in your project.

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Validate

You can now validate the action by referencing `./` in a workflow in your repo (
see [test.yml](.github/workflows/test.yml))

```yaml
uses: ./
with:
  milliseconds: 1000
```

See the [actions tab](https://github.com/actions/typescript-action/actions) for runs of this action! :rocket:

## Usage:

After testing you can [create a v1 tag](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md) to
reference the stable and latest V1 action
