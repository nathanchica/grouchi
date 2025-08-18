import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import tailwindPlugin from 'eslint-plugin-tailwindcss';

export default [
    js.configs.recommended,
    ...tailwindPlugin.configs['flat/recommended'],
    {
        plugins: {
            prettier: prettierPlugin,
            tailwindcss: tailwindPlugin
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                process: 'readonly',
                console: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly'
            }
        },
        rules: {
            ...prettierConfig.rules,
            'prettier/prettier': 'error',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': 'off'
        }
    },
    {
        ignores: ['node_modules/', 'public/css/', '*.min.js']
    }
];
