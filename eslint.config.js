import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    // Mã nguồn game được tách ra từ các file .html (mỗi game 1 file).
    // Trước đây chúng nằm trong .html nên ESLint không quét — giữ nguyên tình trạng
    // để không tự nhiên tăng baseline. Sửa game xong hãy lint riêng nếu cần.
    'src/games/src',
    'src/games/lib',
    // File HTML sinh ra từ lib + src, không sửa tay
    'src/games/offline',
  ]),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
