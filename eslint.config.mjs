// @ts-check

import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  // The Contact form's Lambda runs on Node, not in the browser
  {
    files: ['api/**/*.mjs'],
    languageOptions: { globals: { Buffer: 'readonly', process: 'readonly' } },
  }
)
