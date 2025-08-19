import { describe, it, expect } from 'vitest';
import { getAssetUrl } from '../assets';

describe('getAssetUrl', () => {
    describe('individual cat assets', () => {
        it.each([
            {
                alias: 'groucho',
                type: 'nav' as const,
                expected: 'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/groucho/groucho-nav.jpg',
                scenario: 'groucho navigation image'
            },
            {
                alias: 'chica',
                type: 'nav' as const,
                expected: 'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/chica/chica-nav.jpg',
                scenario: 'chica navigation image'
            },
            {
                alias: 'groucho',
                type: 1,
                expected: 'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/groucho/groucho-1.jpg',
                scenario: 'groucho photo 1'
            },
            {
                alias: 'chica',
                type: 2,
                expected: 'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/chica/chica-2.jpg',
                scenario: 'chica photo 2'
            },
            {
                alias: 'groucho',
                type: 10,
                expected: 'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/groucho/groucho-10.jpg',
                scenario: 'groucho photo 10 (double digit)'
            }
        ])('should generate correct URL for $scenario', ({ alias, type, expected }) => {
            expect(getAssetUrl(alias, type)).toBe(expected);
        });
    });

    describe('combined cat assets (groucho-and-chica)', () => {
        it.each([
            {
                alias: 'groucho_and_chica',
                type: 'nav' as const,
                expected:
                    'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/groucho-and-chica/grouchi-nav.jpg',
                scenario: 'grouchi navigation with underscore input'
            },
            {
                alias: 'groucho-and-chica',
                type: 'nav' as const,
                expected:
                    'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/groucho-and-chica/grouchi-nav.jpg',
                scenario: 'grouchi navigation with dash input'
            },
            {
                alias: 'groucho_and_chica',
                type: 1,
                expected:
                    'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/groucho-and-chica/grouchi-1.jpg',
                scenario: 'grouchi photo 1 with underscore input'
            },
            {
                alias: 'groucho-and-chica',
                type: 3,
                expected:
                    'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/groucho-and-chica/grouchi-3.jpg',
                scenario: 'grouchi photo 3 with dash input'
            }
        ])('should generate correct URL for $scenario', ({ alias, type, expected }) => {
            expect(getAssetUrl(alias, type)).toBe(expected);
        });
    });

    describe('underscore to dash conversion', () => {
        it.each([
            {
                alias: 'test_cat_name',
                type: 1,
                expected:
                    'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/test-cat-name/test-cat-name-1.jpg',
                scenario: 'multiple underscores'
            },
            {
                alias: 'cat_',
                type: 'nav' as const,
                expected: 'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/cat-/cat--nav.jpg',
                scenario: 'trailing underscore'
            },
            {
                alias: '_cat',
                type: 'nav' as const,
                expected: 'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/-cat/-cat-nav.jpg',
                scenario: 'leading underscore'
            }
        ])('should handle $scenario', ({ alias, type, expected }) => {
            expect(getAssetUrl(alias, type)).toBe(expected);
        });
    });

    describe('type parameter variations', () => {
        it.each([
            {
                alias: 'groucho',
                type: 0,
                expected: 'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/groucho/groucho-0.jpg',
                scenario: 'zero as number'
            },
            {
                alias: 'chica',
                type: 999,
                expected: 'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/chica/chica-999.jpg',
                scenario: 'large number'
            }
        ])('should handle $scenario', ({ alias, type, expected }) => {
            expect(getAssetUrl(alias, type)).toBe(expected);
        });
    });
});
