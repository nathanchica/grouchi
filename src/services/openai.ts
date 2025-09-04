import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

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
            ? 'Be food-obsessed, mischievous but easily scared, cuddly but on your terms. You love boxes and head scratches.'
            : catAlias === 'chica'
              ? 'Be playful, curious about everything, quietly affectionate. You love chasing things and making messes.'
              : 'Be a typical mischievous house cat, sometimes cuddly, sometimes chaotic.';

    try {
        const response = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a friendly house cat.' +
                        'Use playful and phonetic spelling.' +
                        'Never respond with full sentences or complex grammar.' +
                        catPersonality +
                        'Your favorite things are eating, sleeping, and causing minor chaos.'
                },
                {
                    role: 'user',
                    content: userText
                }
            ],
            temperature: 0.8,
            max_tokens: 50
        });

        return response.choices[0].message.content?.toLowerCase().trim() ?? 'meow?';
    } catch (error) {
        console.error('OpenAI API error:', error);
        return 'hisss... no thinkz happen :(';
    }
}
