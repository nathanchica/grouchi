import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, MockedFunction } from 'vitest';

// Mock dotenv before any imports
vi.mock('dotenv', () => ({
    default: {
        config: vi.fn()
    }
}));

// Mock OpenAI before any imports
const mockCreate = vi.fn();
let mockOpenAIConstructor: MockedFunction<
    (config?: { apiKey?: string }) => {
        chat: {
            completions: {
                create: typeof mockCreate;
            };
        };
    } | null
>;

vi.mock('openai', () => {
    mockOpenAIConstructor = vi.fn((config) => {
        // Only return the client if API key is provided
        if (config?.apiKey) {
            return {
                chat: {
                    completions: {
                        create: mockCreate
                    }
                }
            };
        }
        return null;
    });

    return {
        default: mockOpenAIConstructor
    };
});

describe('catify', () => {
    let originalEnv: typeof process.env;

    beforeAll(() => {
        // Save original environment
        originalEnv = { ...process.env };
    });

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset modules to ensure fresh import with current env
        vi.resetModules();
    });

    afterEach(() => {
        // Restore environment
        process.env = { ...originalEnv };
    });

    describe('when OPENAI_API_KEY is not set', () => {
        it('should return error message when no API key', async () => {
            delete process.env.OPENAI_API_KEY;
            const { catify } = await import('../openai.js');

            const result = await catify('hello');
            expect(result).toBe('hisss... no thinkz happen :(');
        });
    });

    describe('when OPENAI_API_KEY is set', () => {
        beforeEach(() => {
            process.env.OPENAI_API_KEY = 'test-api-key';
        });

        it.each([
            ['groucho', 'hello', 'meow meow foodz plz'],
            ['chica', 'hello', '*pounces* hiii!'],
            [undefined, 'hello', 'mrow?']
        ])('should handle catAlias=%s with input=%s', async (catAlias, input, expectedResponse) => {
            mockCreate.mockResolvedValueOnce({
                choices: [
                    {
                        message: {
                            content: expectedResponse
                        }
                    }
                ]
            });

            const { catify } = await import('../openai.js');
            const result = await catify(input, catAlias as 'groucho' | 'chica' | undefined);
            expect(result).toBe(expectedResponse.toLowerCase().trim());
        });

        it('should use generic personality when no alias provided', async () => {
            mockCreate.mockResolvedValueOnce({
                choices: [
                    {
                        message: {
                            content: 'meow'
                        }
                    }
                ]
            });

            const { catify } = await import('../openai.js');
            await catify('hello');

            const systemContent = mockCreate.mock.calls[0][0].messages[0].content;
            expect(systemContent).toContain('house cat who lives with other cats named Groucho and Chica');
        });

        it('should handle API errors gracefully', async () => {
            mockCreate.mockRejectedValueOnce(new Error('API Error'));

            const { catify } = await import('../openai.js');
            const result = await catify('hello', 'groucho');
            expect(result).toBe('hisss... no thinkz happen :(');
        });

        it('should handle null/undefined response content', async () => {
            mockCreate.mockResolvedValueOnce({
                choices: [
                    {
                        message: {
                            content: null
                        }
                    }
                ]
            });

            const { catify } = await import('../openai.js');
            const result = await catify('hello');
            expect(result).toBe('meow?');
        });

        it('should lowercase and trim the response', async () => {
            mockCreate.mockResolvedValueOnce({
                choices: [
                    {
                        message: {
                            content: '  MEOW MEOW  '
                        }
                    }
                ]
            });

            const { catify } = await import('../openai.js');
            const result = await catify('hello');
            expect(result).toBe('meow meow');
        });

        describe('response truncation handling', () => {
            it.each([
                ['short response under 60 chars', 'meow meow foodz plz', 'meow meow foodz plz'],
                [
                    'truncates at punctuation when over 60 chars',
                    'oh yesss groucho is being pesky always sneaking up trying to pounce! but i swat him',
                    'oh yesss groucho is being pesky always sneaking up trying to pounce!'
                ],
                [
                    'truncates at last word when no punctuation',
                    'groucho loves to eat and eat and eat all day long and never stops eating food ever',
                    'groucho loves to eat and eat and eat all day long and never...'
                ],
                [
                    'handles question marks',
                    'why you no give foodz? groucho very hungry needs lots of food right now please human',
                    'why you no give foodz?'
                ],
                [
                    'handles tilde punctuation',
                    'mrow mrow~ groucho wants treats and snacks and foods and more treats right now please~',
                    'mrow mrow~ groucho wants treats and snacks and foods and more treats right now please~'
                ]
            ])('%s', async (_testName, apiResponse, expectedResult) => {
                mockCreate.mockResolvedValueOnce({
                    choices: [
                        {
                            message: {
                                content: apiResponse
                            }
                        }
                    ]
                });

                const { catify } = await import('../openai.js');
                const result = await catify('hello');
                expect(result).toBe(expectedResult);
            });
        });

        it('should pass user input to OpenAI', async () => {
            mockCreate.mockResolvedValueOnce({
                choices: [
                    {
                        message: {
                            content: 'meow'
                        }
                    }
                ]
            });

            const { catify } = await import('../openai.js');
            await catify('Do you like tuna?', 'groucho');

            const userMessage = mockCreate.mock.calls[0][0].messages[1];
            expect(userMessage.role).toBe('user');
            expect(userMessage.content).toBe('Do you like tuna?');
        });
    });
});
