//  @ts-check
import { tanstackConfig } from '@tanstack/eslint-config';

export default [
  ...tanstackConfig,
  // Override or add custom rules here
  {
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'sibling',
            'parent',
            'index',
            'unknown',
          ],
          pathGroups: [
            {
              pattern: '@tanstack/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: [], // This is the magic line
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          // This allows types to be mixed in with values alphabetically
          warnOnUnassignedImports: true,
        },
      ],
    },
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {},
    },
  },
];
