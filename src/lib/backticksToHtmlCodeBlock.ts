import { escape as escapeHtml } from 'lodash-es';

/**
 * Converts text wrapped in backticks within a string to HTML code blocks.
 *
 * Escapes HTML chars within the input string (using lodash's escape() func)
 * then replaces instances of backtick-wrapped text with HTML `<code>` tags.
 *
 *
 * @param {string} input - The input string containing text with potential backtick-wrapped sections.
 * @returns {string} - The input string with backtick-wrapped sections converted to `<code>` blocks.
 */
export const backticksToHtmlCodeBlock = (input?: string): string => {
  if (!input) {
    return '';
  }
  const escapedInput = escapeHtml(input);
  const backticksToCodeBlocks = escapedInput.replace(/`([^`]+?)`/g, '<code>$1</code>');
  return backticksToCodeBlocks;
};
