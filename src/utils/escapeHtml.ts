/**
 * Escapes HTML special characters to prevent XSS attacks and rendering issues
 * when displaying user-generated content in HTML.
 *
 * Converts characters that have special meaning in HTML to their HTML entity equivalents:
 * - & becomes &amp;
 * - < becomes &lt; (prevents opening tags)
 * - > becomes &gt; (prevents closing tags)
 * - " becomes &quot; (prevents breaking out of attributes)
 * - ' becomes &#39; (prevents breaking out of attributes)
 *
 * @example
 * escapeHtml("<script>alert('XSS')</script>")
 * // Returns: "&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;"
 * // This will display as plain text instead of executing
 */
export function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
