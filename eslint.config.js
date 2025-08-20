import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import tailwindPlugin from 'eslint-plugin-tailwindcss';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
    js.configs.recommended,
    {
        ...tailwindPlugin.configs['flat/recommended'][0],
        settings: {
            tailwindcss: {
                config: 'tailwind.config.js'
            }
        }
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            '@typescript-eslint': tseslint,
            tailwindcss: tailwindPlugin
        },
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                process: 'readonly',
                console: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly'
            },
            parserOptions: {
                project: './tsconfig.eslint.json'
            }
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-unused-vars': 'off',
            'no-console': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'warn'
        }
    },
    {
        files: ['**/*.js'],
        plugins: {
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
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': 'off'
        }
    },
    {
        files: ['public/js/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'script',
            globals: {
                console: 'readonly',
                window: 'readonly',
                document: 'readonly',
                setTimeout: 'readonly',
                htmx: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': 'off'
        }
    },
    prettierConfig,
    {
        ignores: ['node_modules/', 'public/css/', '*.min.js', 'dist/']
    }
];
