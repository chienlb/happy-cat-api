/**
 * ESLint configuration for the repository.
 *
 * This file intentionally relaxes the @typescript-eslint "no-unsafe-*" rules
 * to avoid noisy errors when working with third-party libs (e.g. Prisma, dotenv).
 * If you prefer stricter linting, revert these rules to "warn" or "error".
 */

module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // If you use type-aware rules, ensure this points to your tsconfig
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    // Disable the strict "no-unsafe-*" rules to reduce false positives when
    // interacting with untyped/third-party code (e.g. runtime error objects).
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',

    // Optionally relax explicit any usage
    '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
