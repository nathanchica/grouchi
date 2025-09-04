import { isValidCatAlias, isValidMessageLength, validateChatInput } from '../validation.js';

describe('isValidCatAlias', () => {
    it.each([
        ['groucho', true],
        ['chica', true],
        ['groucho_and_chica', true]
    ])('should validate correct alias: %s', (alias, expected) => {
        expect(isValidCatAlias(alias)).toBe(expected);
    });

    it.each([
        ['GROUCHO', true],
        ['Chica', true],
        ['Groucho_AND_Chica', true]
    ])('should be case insensitive: %s', (alias, expected) => {
        expect(isValidCatAlias(alias)).toBe(expected);
    });

    it.each([
        ['oscar', false],
        ['felix', false],
        ['', false],
        ['groucho123', false],
        ['groucho ', false],
        [' chica', false],
        ['groucho_chica', false]
    ])('should reject invalid alias: %s', (alias, expected) => {
        expect(isValidCatAlias(alias)).toBe(expected);
    });
});

describe('isValidMessageLength', () => {
    it('should accept messages within default limit', () => {
        expect(isValidMessageLength('Hello')).toBe(true);
        expect(isValidMessageLength('A')).toBe(true);
        expect(isValidMessageLength('A'.repeat(140))).toBe(true);
    });

    it('should reject messages exceeding default limit', () => {
        expect(isValidMessageLength('A'.repeat(141))).toBe(false);
        expect(isValidMessageLength('A'.repeat(200))).toBe(false);
    });

    it('should reject empty messages', () => {
        expect(isValidMessageLength('')).toBe(false);
    });

    it('should handle custom limits', () => {
        expect(isValidMessageLength('Hello', 5)).toBe(true);
        expect(isValidMessageLength('Hello!', 5)).toBe(false);
        expect(isValidMessageLength('Test', 10)).toBe(true);
    });

    it('should handle special characters and emojis', () => {
        const emojiMessage = '😺 Hello cat! 🐱';
        expect(isValidMessageLength(emojiMessage)).toBe(true);

        const specialChars = '<script>alert("test")</script>';
        expect(isValidMessageLength(specialChars)).toBe(true);
    });
});

describe('validateChatInput', () => {
    it('should validate correct input', () => {
        const result = validateChatInput('Hello cat!', 'groucho');
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
    });

    it('should reject invalid cat alias', () => {
        const result = validateChatInput('Hello', 'invalid_cat');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Invalid cat selected');
    });

    it('should reject empty messages', () => {
        const result = validateChatInput('', 'groucho');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Message cannot be empty');
    });

    it('should reject whitespace-only messages', () => {
        const result = validateChatInput('   ', 'chica');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Message cannot be empty');
    });

    it('should reject messages exceeding 140 characters', () => {
        const longMessage = 'A'.repeat(141);
        const result = validateChatInput(longMessage, 'groucho');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Message too long (141/140 characters)');
    });

    it('should accept maximum length messages', () => {
        const maxMessage = 'A'.repeat(140);
        const result = validateChatInput(maxMessage, 'chica');
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
    });

    it('should validate combined cat alias', () => {
        const result = validateChatInput('Hello both cats!', 'groucho_and_chica');
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
    });

    it('should handle messages with special characters', () => {
        const specialMessage = "I'm happy & excited! <3";
        const result = validateChatInput(specialMessage, 'groucho');
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
    });

    it('should handle unicode and emoji messages', () => {
        const emojiMessage = 'Hello 😺🐱 cats!';
        const result = validateChatInput(emojiMessage, 'chica');
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
    });

    it.each([
        [150, 'Message too long (150/140 characters)'],
        [200, 'Message too long (200/140 characters)'],
        [141, 'Message too long (141/140 characters)']
    ])('should provide accurate character count for %i chars', (length, expectedError) => {
        const message = 'A'.repeat(length);
        const result = validateChatInput(message, 'groucho');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(expectedError);
    });
});
