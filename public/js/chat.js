// Chat functionality for the messaging interface

/* exported createUserMessageHTML, createCatMessageHTML, initializeChat, handleMessageSubmit, handleResponseReceived */

// Helper functions for creating message HTML
function createUserMessageHTML(message) {
    // Escape HTML to prevent XSS
    const div = document.createElement('div');
    div.textContent = message;
    const escapedMessage = div.innerHTML;

    return '<div class="bg-blue-500 text-white rounded-lg p-4 max-w-xs"><p>' + escapedMessage + '</p></div>';
}

function createCatMessageHTML(message, profileSrc) {
    // Escape HTML to prevent XSS
    const div = document.createElement('div');
    div.textContent = message;
    const escapedMessage = div.innerHTML;

    return (
        '<img src="' +
        profileSrc +
        '" class="w-10 h-10 rounded-full object-cover flex-shrink-0" />' +
        '<div class="bg-white rounded-lg p-4 shadow-sm max-w-xs"><p class="text-gray-800">' +
        escapedMessage +
        '</p></div>'
    );
}

// Initialize chat for a specific cat
function initializeChat(messagesList) {
    // Get data from attributes
    const catAlias = messagesList.dataset.catAlias;
    const greeting = messagesList.dataset.greeting;
    const profileSrc = messagesList.dataset.profileSrc;

    if (!catAlias) return; // Exit if no cat data

    const storageKey = 'chat-history-' + catAlias;
    let history = JSON.parse(sessionStorage.getItem(storageKey) || '[]');

    // If no history, save the initial greeting but don't re-render
    if (history.length === 0) {
        history.push({ role: 'cat', message: greeting });
        sessionStorage.setItem(storageKey, JSON.stringify(history));
    } else {
        // Clear the server-rendered greeting and show history
        messagesList.innerHTML = '';

        // Add all messages from history
        history.forEach((msg) => {
            const msgDiv = document.createElement('div');
            if (msg.role === 'user') {
                msgDiv.className = 'flex justify-end mb-4';
                msgDiv.innerHTML = createUserMessageHTML(msg.message);
            } else {
                msgDiv.className = 'flex gap-3 items-end mb-4';
                msgDiv.innerHTML = createCatMessageHTML(msg.message, profileSrc);
            }
            messagesList.appendChild(msgDiv);
        });
    }

    // Scroll to bottom
    const container = document.getElementById('messages-container');
    if (container) container.scrollTop = container.scrollHeight;
}

// Handle message submission (called by htmx before-request event)
function handleMessageSubmit(form, catAlias, profileSrc) {
    const storageKey = 'chat-history-' + catAlias;
    let history = JSON.parse(sessionStorage.getItem(storageKey) || '[]');

    // Show user message immediately
    const input = form.querySelector('input[name=message]');
    const messageValue = input.value;
    if (messageValue) {
        // Save to history
        history.push({ role: 'user', message: messageValue });
        sessionStorage.setItem(storageKey, JSON.stringify(history));

        const userMsg = document.createElement('div');
        userMsg.className = 'flex justify-end mb-4';
        userMsg.innerHTML = createUserMessageHTML(messageValue);
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
                typingMsg.className = 'flex gap-3 items-end mb-4';
                typingMsg.innerHTML =
                    '<img src="' +
                    profileSrc +
                    '" class="w-10 h-10 rounded-full object-cover flex-shrink-0" /><div class="bg-gray-100 rounded-lg p-4 max-w-xs"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
                document.getElementById('messages-list').appendChild(typingMsg);

                // Scroll again to show typing indicator
                const container = document.getElementById('messages-container');
                if (container) container.scrollTop = container.scrollHeight;
            }
        }, 500); // 500ms delay before showing typing indicator
    }
}

// Handle response received (called by htmx after-request event)
function handleResponseReceived(catAlias) {
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
        const storageKey = 'chat-history-' + catAlias;
        let history = JSON.parse(sessionStorage.getItem(storageKey) || '[]');
        history.push({ role: 'cat', message: catMessage });
        sessionStorage.setItem(storageKey, JSON.stringify(history));
    }
}

// Auto-initialize chat when DOM is loaded or when new chat view is loaded via HTMX
document.addEventListener('DOMContentLoaded', function () {
    const messagesList = document.getElementById('messages-list');
    if (messagesList) {
        initializeChat(messagesList);
    }
});

// Also initialize when HTMX loads new chat content
document.addEventListener('htmx:afterSwap', function (event) {
    if (event.detail.target.id === 'chat-messages') {
        // Find the new messages list in the swapped content
        const messagesList = document.getElementById('messages-list');
        if (messagesList) {
            initializeChat(messagesList);
        }
    }
});
