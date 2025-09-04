import { Router, Request, Response } from 'express';

import { catsData } from '../src/data/cats.js';
import { catify } from '../src/services/openai.js';

const router: Router = Router();

router.get('/messages/:catAlias', async (req: Request, res: Response): Promise<void> => {
    const { catAlias } = req.params;
    const { displayName, profilePhoto } = catsData[catAlias];
    const bgColor = catAlias === 'groucho' ? 'bg-blue-100' : catAlias === 'chica' ? 'bg-pink-100' : 'bg-gray-100';
    const accentColor = catAlias === 'groucho' ? 'bg-blue-50' : catAlias === 'chica' ? 'bg-pink-50' : 'bg-gray-50';

    // Generate a cat message with personality based on which cat
    const catMessage = await catify('Hello!', catAlias as 'groucho' | 'chica');

    res.send(/* html */ `
        <div id="chat-messages" class="col-span-9 ${bgColor} flex flex-col h-full">
            <div id="chat-title" class="${accentColor} px-8 py-4 shadow w-full flex flex-row items-center flex-shrink-0">
                <img src="${profilePhoto?.src}" alt="${profilePhoto?.altText}" class="inline-block w-12 h-12 rounded-full mr-4 object-cover" />
                <h3 class="text-xl font-bold text-gray-800">${displayName}</h3>
            </div>
            <div id="messages-container" class="flex-1 overflow-y-auto p-8">
                <div class="space-y-4">
                    <div class="flex gap-3 items-center">
                        <img src="${profilePhoto?.src}" alt="${profilePhoto?.altText}" class="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                        <div class="bg-white rounded-lg p-4 shadow-sm">
                            <p class="text-gray-800">${catMessage}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="chat-input-container" class="${accentColor} p-4 flex-shrink-0">
                <div class="flex gap-2">
                    <input 
                        type="text" 
                        id="chat-input"
                        placeholder="Type a message..."
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button class="p-2 cursor-pointer text-blue-500 hover:text-blue-600 transition-colors">
                        <i class="fas fa-paper-plane text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
    `);
});

router.get('/nav', (req: Request, res: Response): void => {
    const { groucho, chica } = catsData;

    res.send(/* html */ `
        <div id="chat-navigation" class="py-8 pl-8 col-span-3">
            <h2 class="mb-6 text-2xl font-bold text-gray-800">Chat with my cats!</h2>
            <div id="chat-nav-buttons" class="space-y-2">
                <button
                    id="chat-groucho"
                    class="w-full rounded-l-md bg-blue-100 px-4 py-2 text-left text-gray-800 hover:bg-blue-200 cursor-pointer"
                    hx-get="/api/chat/messages/groucho"
                    hx-target="#chat-messages"
                    hx-swap="outerHTML"
                >
                    <img src="${groucho.profilePhoto?.src}" alt="${groucho.profilePhoto?.altText}" class="inline-block w-12 h-12 rounded-full mr-2 object-cover" /> ${groucho.displayName}
                </button>
                <button
                    id="chat-chica"
                    class="w-full rounded-l-md bg-pink-100 px-4 py-2 text-left text-gray-800 hover:bg-pink-200 cursor-pointer"
                    hx-get="/api/chat/messages/chica"
                    hx-target="#chat-messages"
                    hx-swap="outerHTML"
                >
                    <img src="${chica.profilePhoto?.src}" alt="${chica.profilePhoto?.altText}" class="inline-block w-12 h-12 rounded-full mr-2 object-cover" /> ${chica.displayName}
                </button>
            </div>
        </div>
    `);
});

export default router;
