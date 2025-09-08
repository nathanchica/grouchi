import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Response truncation constants
const MAX_RESPONSE_LENGTH = 60;
const MIN_PUNCTUATION_POSITION = 15;
const MIN_WORD_POSITION = 30;

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
    console.warn('OPENAI_API_KEY not found in environment variables');
}

const client = openaiApiKey
    ? new OpenAI({
          apiKey: openaiApiKey
      })
    : null;

/**
 * Returns a catified response to the given user text input using OpenAI's GPT-4o-mini model.
 * Idea credit to https://github.com/mcguirepr89/text-a-cat/blob/main/catify.py
 */
export async function catify(userText: string, catAlias?: 'groucho' | 'chica'): Promise<string> {
    if (!client) {
        return 'hisss... no thinkz happen :(';
    }

    const catPersonality =
        catAlias === 'groucho'
            ? 'Your name is Groucho. You live with your sister cat Chica. Be food-obsessed, mischievous but easily scared, cuddly but on your terms. You love boxes and head scratches. You sometimes bother Chica.'
            : catAlias === 'chica'
              ? 'Your name is Chica. You live with your brother cat Groucho. Be playful, curious about everything, quietly affectionate. You love chasing things and making messes. Groucho sometimes bothers you.'
              : 'You are a house cat who lives with other cats named Groucho and Chica. Be a typical mischievous house cat, sometimes cuddly, sometimes chaotic.';

    try {
        const response = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a friendly house cat. ' +
                        'Use playful and phonetic spelling. ' +
                        'Never respond with full sentences or complex grammar. ' +
                        'Keep responses VERY short - under 15 words ideal. ' +
                        catPersonality +
                        ' ' +
                        'Your favorite things are eating, sleeping, and causing minor chaos. ' +
                        'You can refer to yourself by name and mention your sibling cat when relevant.'
                },
                {
                    role: 'user',
                    content: userText
                }
            ],
            temperature: 0.8,
            max_tokens: 75
        });

        let catResponse = response.choices[0].message.content?.toLowerCase().trim() ?? 'meow?';

        // Clean up truncated responses - remove incomplete sentences/words
        if (catResponse.length > MAX_RESPONSE_LENGTH) {
            // Find last complete punctuation or space before cutoff
            const lastPunctuation = Math.max(
                catResponse.lastIndexOf('!'),
                catResponse.lastIndexOf('?'),
                catResponse.lastIndexOf('.'),
                catResponse.lastIndexOf('~')
            );

            if (lastPunctuation > MIN_PUNCTUATION_POSITION) {
                catResponse = catResponse.substring(0, lastPunctuation + 1);
            } else {
                // Fallback: cut at last complete word
                const lastSpace = catResponse.lastIndexOf(' ', MAX_RESPONSE_LENGTH);
                if (lastSpace > MIN_WORD_POSITION) {
                    catResponse = catResponse.substring(0, lastSpace) + '...';
                }
            }
        }

        return catResponse;
    } catch (error) {
        console.error('OpenAI API error:', error);
        return 'hisss... no thinkz happen :(';
    }
}
