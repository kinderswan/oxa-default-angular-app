/* eslint-env es6 */
const { pathsToModuleNameMapper } = require('ts-jest')

const { compilerOptions } = require('./tsconfig.json')

globalThis.ngJest = {
  skipNgcc: true,
  tsconfig: 'tsconfig.spec.json',
}

/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  testEnvironmentOptions: {
    ngJest: {
      errorOnUnknownElements: true,
      errorOnUnknownProperties: true,
    },
  },
  moduleDirectories: ['node_modules', __dirname],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
}
