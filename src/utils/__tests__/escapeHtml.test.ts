import { escapeHtml } from '../escapeHtml';

describe('escapeHtml', () => {
    it('should escape HTML tags', () => {
        expect(escapeHtml('<div>Hello</div>')).toBe('&lt;div&gt;Hello&lt;/div&gt;');
        expect(escapeHtml('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    });

    it('should escape ampersands', () => {
        expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
        expect(escapeHtml('&&&')).toBe('&amp;&amp;&amp;');
    });

    it('should escape quotes', () => {
        expect(escapeHtml('"Hello"')).toBe('&quot;Hello&quot;');
        expect(escapeHtml("I'm happy")).toBe('I&#39;m happy');
        expect(escapeHtml(`"It's a test"`)).toBe('&quot;It&#39;s a test&quot;');
    });

    it('should escape multiple special characters', () => {
        expect(escapeHtml('<a href="test.html">Click & Go</a>')).toBe(
            '&lt;a href=&quot;test.html&quot;&gt;Click &amp; Go&lt;/a&gt;'
        );
    });

    it('should handle empty strings', () => {
        expect(escapeHtml('')).toBe('');
    });

    it('should handle strings without special characters', () => {
        expect(escapeHtml('Hello World')).toBe('Hello World');
        expect(escapeHtml('123456789')).toBe('123456789');
        expect(escapeHtml('test_user-name.123')).toBe('test_user-name.123');
    });

    it('should handle unicode characters', () => {
        expect(escapeHtml('Hello 👋 World')).toBe('Hello 👋 World');
        expect(escapeHtml('日本語')).toBe('日本語');
    });

    it.each([
        ['<img src=x onerror="alert(1)">', '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;'],
        ['<svg onload="alert(1)">', '&lt;svg onload=&quot;alert(1)&quot;&gt;'],
        ['<iframe src="javascript:alert(1)">', '&lt;iframe src=&quot;javascript:alert(1)&quot;&gt;'],
        ['<<script>alert("XSS");//<</script>', '&lt;&lt;script&gt;alert(&quot;XSS&quot;);//&lt;&lt;/script&gt;'],
        ['<script>alert(1)</script>', '&lt;script&gt;alert(1)&lt;/script&gt;']
    ])('should prevent XSS: %s', (input, expected) => {
        const escaped = escapeHtml(input);
        expect(escaped).toBe(expected);
        // Verify no dangerous tags remain
        expect(escaped).not.toContain('<script');
        expect(escaped).not.toContain('<img');
        expect(escaped).not.toContain('<svg');
        expect(escaped).not.toContain('<iframe');
    });

    it('should escape HTML entities in cat messages', () => {
        // Real-world examples from chat messages
        expect(escapeHtml("I'm a cat & I love <treats>!")).toBe('I&#39;m a cat &amp; I love &lt;treats&gt;!');
        expect(escapeHtml('Meow "loudly"')).toBe('Meow &quot;loudly&quot;');
    });
});
