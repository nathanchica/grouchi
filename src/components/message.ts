import { escapeHtml } from '../utils/escapeHtml';

interface CatMessageProps {
    message: string;
    profilePhoto?: {
        src: string;
        altText: string;
    };
}

export function renderCatMessage({ message, profilePhoto }: CatMessageProps): string {
    const imgTag = profilePhoto
        ? `<img src="${profilePhoto.src}" alt="${profilePhoto.altText}" class="w-10 h-10 rounded-full object-cover flex-shrink-0" />`
        : '';

    return /* html */ `
        <div class="flex gap-3 items-end mb-4">
            ${imgTag}
            <div class="bg-white rounded-lg p-4 shadow-sm max-w-xs">
                <p class="text-gray-800">${escapeHtml(message)}</p>
            </div>
        </div>
    `;
}

export function renderUserMessage(message: string): string {
    return /* html */ `
        <div class="flex justify-end mb-4">
            <div class="bg-blue-500 text-white rounded-lg p-4 max-w-xs">
                <p>${escapeHtml(message)}</p>
            </div>
        </div>
    `;
}
