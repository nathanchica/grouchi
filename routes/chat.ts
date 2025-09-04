import { Router, Request, Response } from 'express';

import { catsData } from '../src/data/cats.js';
import { catify } from '../src/services/openai.js';

const router: Router = Router();

// Simple cache for initial greetings (regenerated on each deploy)
const greetingCache: { [key: string]: string } = {};

router.get('/messages/:catAlias', async (req: Request, res: Response): Promise<void> => {
    const { catAlias } = req.params;
    const { displayName, profilePhoto } = catsData[catAlias];
    const bgColor = catAlias === 'groucho' ? 'bg-blue-100' : catAlias === 'chica' ? 'bg-pink-100' : 'bg-gray-100';
    const accentColor = catAlias === 'groucho' ? 'bg-blue-50' : catAlias === 'chica' ? 'bg-pink-50' : 'bg-gray-50';

    // Get or generate initial greeting (cached for performance)
    if (!greetingCache[catAlias]) {
        greetingCache[catAlias] = await catify('Hello!', catAlias as 'groucho' | 'chica');
    }
    const greeting = greetingCache[catAlias];

    // Build initial message HTML
    const messagesHtml = /* html */ `
        <div class="flex gap-3 items-start mb-4">
            <img src="${profilePhoto?.src}" alt="${profilePhoto?.altText}" class="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            <div class="bg-white rounded-lg p-4 shadow-sm max-w-xs">
                <p class="text-gray-800">${greeting}</p>
            </div>
        </div>
    `;

    res.send(/* html */ `
        <div id="chat-messages" class="col-span-9 ${bgColor} flex flex-col h-full overflow-hidden">
            <div id="chat-title" class="${accentColor} px-8 py-4 shadow w-full flex flex-row items-center flex-shrink-0">
                <img src="${profilePhoto?.src}" alt="${profilePhoto?.altText}" class="inline-block w-12 h-12 rounded-full mr-4 object-cover" />
                <h3 class="text-xl font-bold text-gray-800">${displayName}</h3>
            </div>
            <div id="messages-container" class="flex-1 overflow-y-auto p-8 min-h-0">
                <div id="messages-list" class="space-y-4">
                    ${messagesHtml}
                </div>
                <script>
                    // Load chat history from sessionStorage
                    (function() {
                        const storageKey = 'chat-history-${catAlias}';
                        let history = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
                        const messagesList = document.getElementById('messages-list');
                        
                        // If no history, save the initial greeting but don't re-render (already shown)
                        if (history.length === 0) {
                            const greeting = '${greeting.replace(/'/g, "\\'")}';
                            history.push({ role: 'cat', message: greeting });
                            sessionStorage.setItem(storageKey, JSON.stringify(history));
                            // Don't add messages since the greeting is already rendered
                        } else {
                            // Clear the server-rendered greeting and show history
                            messagesList.innerHTML = '';
                            
                            // Add all messages from history
                            history.forEach(msg => {
                                const msgDiv = document.createElement('div');
                                if (msg.role === 'user') {
                                    msgDiv.className = 'flex justify-end mb-4';
                                    msgDiv.innerHTML = '<div class="bg-blue-500 text-white rounded-lg p-4 max-w-xs"><p>' + msg.message + '</p></div>';
                                } else {
                                    msgDiv.className = 'flex gap-3 items-start mb-4';
                                    msgDiv.innerHTML = '<img src="${profilePhoto?.src}" class="w-10 h-10 rounded-full object-cover flex-shrink-0" /><div class="bg-white rounded-lg p-4 shadow-sm max-w-xs"><p class="text-gray-800">' + msg.message + '</p></div>';
                                }
                                messagesList.appendChild(msgDiv);
                            });
                        }
                        
                        // Scroll to bottom
                        const container = document.getElementById('messages-container');
                        if (container) container.scrollTop = container.scrollHeight;
                    })();
                </script>
            </div>
            <div id="chat-input-container" class="${accentColor} p-4 flex-shrink-0">
                <form 
                    hx-post="/api/chat/send/${catAlias}"
                    hx-target="#messages-list"
                    hx-swap="beforeend"
                    hx-disabled-elt="this"
                    class="flex gap-2"
                    id="chat-form"
                    hx-on::before-request="
                        // Store message in sessionStorage
                        const storageKey = 'chat-history-${catAlias}';
                        let history = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
                        
                        // Show user message immediately
                        const input = this.querySelector('input[name=message]');
                        const messageValue = input.value;
                        if (messageValue) {
                            // Save to history
                            history.push({ role: 'user', message: messageValue });
                            sessionStorage.setItem(storageKey, JSON.stringify(history));
                            
                            const userMsg = document.createElement('div');
                            userMsg.className = 'flex justify-end mb-4';
                            userMsg.innerHTML = '<div class=\\'bg-blue-500 text-white rounded-lg p-4 max-w-xs\\'><p>' + messageValue + '</p></div>';
                            document.getElementById('messages-list').appendChild(userMsg);
                            
                            // Clear input
                            input.value = '';
                            
                            // Scroll to bottom
                            const container = document.getElementById('messages-container');
                            if (container) container.scrollTop = container.scrollHeight;
                            
                            // Set flag for pending request
                            window.chatRequestPending = true;
                            
                            // Show typing indicator after a delay
                            setTimeout(() => {
                                // Only show if request is still pending
                                if (window.chatRequestPending) {
                                    const typingMsg = document.createElement('div');
                                    typingMsg.id = 'temp-typing';
                                    typingMsg.className = 'flex gap-3 items-start mb-4';
                                    typingMsg.innerHTML = '<img src=\\'${profilePhoto?.src}\\' class=\\'w-10 h-10 rounded-full object-cover flex-shrink-0\\' /><div class=\\'bg-gray-100 rounded-lg p-4 max-w-xs\\'><div class=\\'typing-dots\\'><span></span><span></span><span></span></div></div>';
                                    document.getElementById('messages-list').appendChild(typingMsg);
                                    
                                    // Scroll again to show typing indicator
                                    const container = document.getElementById('messages-container');
                                    if (container) container.scrollTop = container.scrollHeight;
                                }
                            }, 500); // 500ms delay before showing typing indicator
                        }
                    "
                    hx-on::after-request="
                        // Clear pending flag
                        window.chatRequestPending = false;
                        
                        // Remove typing indicator
                        const typing = document.getElementById('temp-typing');
                        if (typing) typing.remove();
                        
                        // Save cat response to sessionStorage
                        // We'll extract the message from the last added element
                        const messages = document.querySelectorAll('#messages-list > div');
                        const lastMessage = messages[messages.length - 1];
                        if (lastMessage && lastMessage.querySelector('.bg-white')) {
                            const catMessage = lastMessage.querySelector('p').textContent;
                            const storageKey = 'chat-history-${catAlias}';
                            let history = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
                            history.push({ role: 'cat', message: catMessage });
                            sessionStorage.setItem(storageKey, JSON.stringify(history));
                        }
                    "
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
    const { profilePhoto } = catsData[catAlias];

    // Generate cat response
    const catResponse = await catify(message, catAlias as 'groucho' | 'chica');

    // Add a small delay to simulate "thinking" time (makes typing indicator visible)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Send only the cat message (user message already shown via JS)
    res.send(/* html */ `
        <!-- Cat message -->
        <div class="flex gap-3 items-start mb-4">
            <img src="${profilePhoto?.src}" alt="${profilePhoto?.altText}" class="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            <div class="bg-white rounded-lg p-4 shadow-sm max-w-xs">
                <p class="text-gray-800">${catResponse}</p>
            </div>
        </div>
        
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
