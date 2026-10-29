// @ts-check

import eslint from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
  // Build output, if a local build has run
  globalIgnores(['dist/']),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  // The Contact form's Lambda runs on Node, not in the browser
  {
    files: ['api/**/*.mjs'],
    languageOptions: { globals: { Buffer: 'readonly', process: 'readonly' } },
  }
)
