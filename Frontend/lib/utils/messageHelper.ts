import { MESSAGES } from '../constants/messages';

/**
 * Gets a message by code and replaces placeholders with provided parameters.
 * 
 * @param code Message code (e.g., 'ER001', 'MSG005')
 * @param params Optional parameters to replace {0}, {1}, etc. in order
 * @returns The formatted message or the code if not found in dictionary
 */
export function getMessage(code: string, params: (string | number)[] = []): string {
  let message = MESSAGES[code] || code;

  if (!params || params.length === 0) {
    return message;
  }

  params.forEach((param, index) => {
    const placeholder = `{${index}}`;
    message = message.replace(placeholder, String(param));
  });

  return message;
}

/**
 * Helper to check if a string is a message code.
 */
export function isMessageCode(value: string): boolean {
  return value in MESSAGES;
}
