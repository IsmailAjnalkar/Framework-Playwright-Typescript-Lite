// String manipulation utilities for test data and validation.
export class StringHelpers {
  // Capitalize first letter of a string
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // Convert string to title case
  static toTitleCase(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  }

  // Remove all whitespace from a string
  static removeWhitespace(str: string): string {
    return str.replace(/\s/g, '');
  }

  // Remove extra whitespace and trim
  static normalizeWhitespace(str: string): string {
    return str.replace(/\s+/g, ' ').trim();
  }

  // Generate a slug from a string (URL-friendly)
  static toSlug(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  // Truncate string to specified length with ellipsis
  static truncate(str: string, maxLength: number, suffix: string = '...'): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - suffix.length) + suffix;
  }

  // Reverse a string
  static reverse(str: string): string {
    return str.split('').reverse().join('');
  }

  // Check if string is palindrome
  static isPalindrome(str: string): boolean {
    const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleanStr === this.reverse(cleanStr);
  }

  // Count occurrences of a substring
  static countOccurrences(str: string, substring: string): number {
    return str.split(substring).length - 1;
  }

  // Extract numbers from string
  static extractNumbers(str: string): number[] {
    const matches = str.match(/\d+/g);
    return matches ? matches.map(Number) : [];
  }

  // Extract email addresses from string
  static extractEmails(str: string): string[] {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    return str.match(emailRegex) || [];
  }

  // Generate random string of specified length and character set
  static generateRandomString(
    length: number,
    charset: string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  ): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  // Check if string contains only alphanumeric characters
  static isAlphanumeric(str: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(str);
  }

  // Check if string contains only alphabetic characters
  static isAlphabetic(str: string): boolean {
    return /^[a-zA-Z]+$/.test(str);
  }

  // Check if string contains only numeric characters
  static isNumeric(str: string): boolean {
    return /^[0-9]+$/.test(str);
  }

  // Pad string to specified length
  static padLeft(str: string, length: number, padChar: string = ' '): string {
    return str.padStart(length, padChar);
  }

  static padRight(str: string, length: number, padChar: string = ' '): string {
    return str.padEnd(length, padChar);
  }

  // Remove HTML tags from string
  static stripHtmlTags(str: string): string {
    return str.replace(/<[^>]*>/g, '');
  }

  // Escape special regex characters
  static escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Convert camelCase to kebab-case
  static camelToKebab(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  // Convert kebab-case to camelCase
  static kebabToCamel(str: string): string {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  // Get initials from a full name
  static getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  }

  // Mask sensitive information (e.g., credit card numbers)
  static maskString(
    str: string,
    visibleStart: number = 4,
    visibleEnd: number = 4,
    maskChar: string = '*'
  ): string {
    if (str.length <= visibleStart + visibleEnd) return str;
    const start = str.substring(0, visibleStart);
    const end = str.substring(str.length - visibleEnd);
    const maskLength = str.length - visibleStart - visibleEnd;
    const mask = maskChar.repeat(maskLength);
    return start + mask + end;
  }
}
