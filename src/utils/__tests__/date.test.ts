import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateAge } from '../date';

describe('calculateAge', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it.each([
        {
            currentDate: '2024-03-15',
            birthDate: '2023-03-15',
            expectedYears: 1,
            expectedMonths: 0,
            scenario: 'exactly one year ago'
        },
        {
            currentDate: '2024-08-20',
            birthDate: '2020-01-10',
            expectedYears: 4,
            expectedMonths: 7,
            scenario: 'several years and months ago'
        },
        {
            currentDate: '2024-03-10',
            birthDate: '2023-03-20',
            expectedYears: 0,
            expectedMonths: 11,
            scenario: 'same month but later day'
        },
        {
            currentDate: '2024-03-15',
            birthDate: '2023-05-20',
            expectedYears: 0,
            expectedMonths: 9,
            scenario: 'dates are of different years but age is under 1 year'
        },
        { currentDate: '2024-03-15', birthDate: '2024-03-15', expectedYears: 0, expectedMonths: 0, scenario: 'today' },
        {
            currentDate: '2024-03-15',
            birthDate: '2024-02-15',
            expectedYears: 0,
            expectedMonths: 1,
            scenario: 'one month ago'
        },
        {
            currentDate: '2024-02-29',
            birthDate: '2020-02-29',
            expectedYears: 4,
            expectedMonths: 0,
            scenario: 'leap year to leap year'
        },
        {
            currentDate: '2023-02-28',
            birthDate: '2020-02-29',
            expectedYears: 2,
            expectedMonths: 11,
            scenario: 'leap year birth to non-leap year'
        },
        {
            currentDate: '2024-03-31',
            birthDate: '2024-01-31',
            expectedYears: 0,
            expectedMonths: 2,
            scenario: 'end of month'
        },
        {
            currentDate: '2024-03-01',
            birthDate: '2023-03-01',
            expectedYears: 1,
            expectedMonths: 0,
            scenario: 'beginning of month'
        },
        {
            currentDate: '2024-01-15',
            birthDate: '2023-12-15',
            expectedYears: 0,
            expectedMonths: 1,
            scenario: 'crossing year boundary'
        },
        {
            currentDate: '2024-09-15',
            birthDate: '2024-03-15',
            expectedYears: 0,
            expectedMonths: 6,
            scenario: 'exactly 6 months'
        },
        {
            currentDate: '2024-07-25',
            birthDate: '2019-04-10',
            expectedYears: 5,
            expectedMonths: 3,
            scenario: 'multiple years with partial months'
        },
        {
            currentDate: '2023-03-28',
            birthDate: '2023-02-28',
            expectedYears: 0,
            expectedMonths: 1,
            scenario: 'last day of February non-leap year'
        }
    ])('should calculate age for $scenario', ({ currentDate, birthDate, expectedYears, expectedMonths }) => {
        vi.setSystemTime(new Date(currentDate));
        const age = calculateAge(new Date(birthDate));

        expect(age.years).toBe(expectedYears);
        expect(age.months).toBe(expectedMonths);
    });

    describe('future date validation', () => {
        it.each([
            { currentDate: '2024-03-15', birthDate: '2024-03-16', scenario: 'one day in the future' },
            { currentDate: '2024-03-15', birthDate: '2025-03-15', scenario: 'one year in the future' },
            { currentDate: '2024-03-15', birthDate: '2024-04-15', scenario: 'one month in the future' },
            { currentDate: '2024-03-15', birthDate: '2030-01-01', scenario: 'several years in the future' }
        ])('should throw error for $scenario', ({ currentDate, birthDate }) => {
            vi.setSystemTime(new Date(currentDate));

            expect(() => calculateAge(new Date(birthDate))).toThrowError('Birth date cannot be in the future');
        });
    });

    describe('edge cases', () => {
        it.each([
            {
                currentDate: '2024-02-29',
                birthDate: '2024-02-28',
                expectedYears: 0,
                expectedMonths: 0,
                scenario: 'birth day before leap day'
            },
            {
                currentDate: '2024-03-01',
                birthDate: '2024-02-29',
                expectedYears: 0,
                expectedMonths: 0,
                scenario: 'birth on leap day, current day after'
            },
            {
                currentDate: '2024-12-31',
                birthDate: '2024-01-01',
                expectedYears: 0,
                expectedMonths: 11,
                scenario: 'start to end of year'
            },
            {
                currentDate: '2025-01-01',
                birthDate: '2024-01-01',
                expectedYears: 1,
                expectedMonths: 0,
                scenario: 'exactly one year, new year'
            }
        ])('handles edge case: $scenario', ({ currentDate, birthDate, expectedYears, expectedMonths }) => {
            vi.setSystemTime(new Date(currentDate));
            const age = calculateAge(new Date(birthDate));

            expect(age.years).toBe(expectedYears);
            expect(age.months).toBe(expectedMonths);
        });
    });

    describe('boundary conditions', () => {
        it.each([
            {
                currentDate: '2024-05-31',
                birthDate: '2024-03-31',
                expectedYears: 0,
                expectedMonths: 2,
                scenario: 'both dates on 31st'
            },
            {
                currentDate: '2024-05-30',
                birthDate: '2024-02-29',
                expectedYears: 0,
                expectedMonths: 3,
                scenario: 'leap day to 30th'
            },
            {
                currentDate: '2024-04-30',
                birthDate: '2024-01-31',
                expectedYears: 0,
                expectedMonths: 2,
                scenario: '31st to 30th'
            }
        ])('handles month-end boundary: $scenario', ({ currentDate, birthDate, expectedYears, expectedMonths }) => {
            vi.setSystemTime(new Date(currentDate));
            const age = calculateAge(new Date(birthDate));

            expect(age.years).toBe(expectedYears);
            expect(age.months).toBe(expectedMonths);
        });
    });
});
