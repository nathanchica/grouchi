import { VALID_ALIASES } from '../data/cats';

/**
 * Validates if a cat alias is valid
 * @param alias The cat alias to validate
 * @returns True if valid, false otherwise
 */
export function isValidCatAlias(alias: string): boolean {
    return VALID_ALIASES.includes(alias.toLowerCase());
}

/**
 * Validates if a message is within the character limit
 * @param message The message to validate
 * @param maxLength Maximum allowed length (default: 140)
 * @returns True if valid, false otherwise
 */
export function isValidMessageLength(message: string, maxLength: number = 140): boolean {
    if (!message || message.length === 0) return false;
    return message.length <= maxLength;
}

/**
 * Validates chat message input
 * @param message The message to validate
 * @param catAlias The cat alias to validate
 * @returns Object with validation result and error message if invalid
 */
export function validateChatInput(
    message: string,
    catAlias: string
): {
    isValid: boolean;
    error?: string;
} {
    if (!isValidCatAlias(catAlias)) {
        return {
            isValid: false,
            error: 'Invalid cat selected'
        };
    }

    if (!message || message.trim().length === 0) {
        return {
            isValid: false,
            error: 'Message cannot be empty'
        };
    }

    if (message.length > 140) {
        return {
            isValid: false,
            error: `Message too long (${message.length}/140 characters)`
        };
    }

    return { isValid: true };
}
