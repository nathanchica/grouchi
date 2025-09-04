import { Router, Request, Response } from 'express';

import { catsData } from '../src/data/cats.js';
import { catify } from '../src/services/openai.js';
import { renderCatMessage } from '../src/components/message.js';
import { validateChatInput, isValidCatAlias } from '../src/utils/validation.js';
import { escapeHtml } from '../src/utils/escapeHtml.js';

const router: Router = Router();

// Simple cache for initial greetings
const greetingCache: { [key: string]: string } = {};

router.get('/messages/:catAlias', async (req: Request, res: Response): Promise<void> => {
    const { catAlias } = req.params;

    // Validate cat alias
    if (!isValidCatAlias(catAlias)) {
        res.status(404).send(/* html */ `
            <div class="col-span-9 bg-gray-50 flex items-center justify-center h-full">
                <div class="text-center">
                    <i class="fas fa-cat text-4xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600">Cat not found!</p>
                </div>
            </div>
        `);
        return;
    }

    const { displayName, profilePhoto } = catsData[catAlias];
    const bgColor = catAlias === 'groucho' ? 'bg-blue-100' : catAlias === 'chica' ? 'bg-pink-100' : 'bg-gray-100';
    const accentColor = catAlias === 'groucho' ? 'bg-blue-50' : catAlias === 'chica' ? 'bg-pink-50' : 'bg-gray-50';

    // Get or generate initial greeting
    if (!greetingCache[catAlias]) {
        greetingCache[catAlias] = await catify('Hello!', catAlias as 'groucho' | 'chica');
    }
    const greeting = greetingCache[catAlias];

    // Build initial message HTML
    const messagesHtml = renderCatMessage({ message: greeting, profilePhoto });

    res.send(/* html */ `
        <div id="chat-messages" class="col-span-9 ${bgColor} flex flex-col h-full overflow-hidden">
            <div id="chat-title" class="${accentColor} px-8 py-4 shadow w-full flex flex-row items-center flex-shrink-0">
                <img src="${profilePhoto?.src}" alt="${profilePhoto?.altText}" class="inline-block w-12 h-12 rounded-full mr-4 object-cover" />
                <h3 class="text-xl font-bold text-gray-800">${displayName}</h3>
            </div>

            <div id="messages-container" class="flex-1 overflow-y-auto p-8 min-h-0">
                <div
                    id="messages-list"
                    class="space-y-4"
                    data-cat-alias="${catAlias}"
                    data-greeting="${escapeHtml(greeting)}"
                    data-profile-src="${profilePhoto?.src}"
                >
                    ${messagesHtml}
                </div>
            </div>
            <div id="chat-input-container" class="${accentColor} p-4 flex-shrink-0">
                <form 
                    hx-post="/api/chat/send/${catAlias}"
                    hx-target="#messages-list"
                    hx-swap="beforeend"
                    hx-disabled-elt="this"
                    class="flex gap-2"
                    id="chat-form"
                    hx-on::before-request="handleMessageSubmit(this, '${catAlias}', '${profilePhoto?.src}')"
                    hx-on::after-request="handleResponseReceived('${catAlias}')"
                >
                    <input 
                        type="text" 
                        name="message"
                        id="chat-input"
                        placeholder="Type a message..."
                        required
                        autocomplete="off"
                        maxlength="140"
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button type="submit" class="p-2 cursor-pointer text-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <i class="fas fa-paper-plane text-xl"></i>
                    </button>
                </form>
            </div>
        </div>
    `);
});

// Generates catified responses based on user input and displays them
router.post('/send/:catAlias', async (req: Request, res: Response): Promise<void> => {
    const { catAlias } = req.params;
    const { message } = req.body;

    // Validate input
    const validation = validateChatInput(message, catAlias);
    if (!validation.isValid) {
        res.status(400).send(/* html */ `
            <div class="flex gap-3 items-end mb-4">
                <i class="fas fa-exclamation-triangle text-red-500 mt-1"></i>
                <div class="bg-red-100 rounded-lg p-4 shadow-sm max-w-xs">
                    <p class="text-red-700">${validation.error}</p>
                </div>
            </div>
        `);
        return;
    }

    const { profilePhoto } = catsData[catAlias];

    // Generate cat response
    const catResponse = await catify(message, catAlias as 'groucho' | 'chica');

    // Add a small delay to simulate "thinking" time (makes typing indicator visible)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Send only the cat message (user message already shown via JS)
    res.send(/* html */ `
        ${renderCatMessage({ message: catResponse, profilePhoto })}
        
        <!-- Scroll to bottom -->
        <script>
            setTimeout(() => {
                const container = document.getElementById('messages-container');
                if (container) container.scrollTop = container.scrollHeight;
            }, 50);
        </script>
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
