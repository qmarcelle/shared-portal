import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

/* eslint-disable-next-line import/no-anonymous-default-export */
export default [
  ...compat.extends(
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    ignores: ['*.json'],
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
        },
      ],
    },
  },
];
