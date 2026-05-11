// Data validation utilities for test data and form validation.
export class ValidationHelpers {
  // Email validation
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone number validation (US format)
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  // URL validation
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Credit card number validation (basic Luhn algorithm)
  static isValidCreditCard(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\D/g, '');
    if (cleaned.length < 13 || cleaned.length > 19) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  // Password strength validation
  static isStrongPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongRegex.test(password);
  }

  // ZIP code validation (US)
  static isValidZipCode(zipCode: string): boolean {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  }

  // SSN validation (US Social Security Number)
  static isValidSSN(ssn: string): boolean {
    const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
    if (!ssnRegex.test(ssn)) return false;

    // Check for invalid patterns (all zeros, etc.)
    const parts = ssn.split('-');
    const area = parseInt(parts[0]);
    const group = parseInt(parts[1]);
    const serial = parseInt(parts[2]);

    if (area === 0 || area === 666 || (area >= 900 && area <= 999)) return false;
    if (group === 0) return false;
    if (serial === 0) return false;

    return true;
  }

  // Date validation
  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.toISOString().startsWith(dateString.split('T')[0]);
  }

  // Age validation (must be between min and max age)
  static isValidAge(birthDate: Date, minAge: number = 0, maxAge: number = 150): boolean {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    const actualAge =
      monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

    return actualAge >= minAge && actualAge <= maxAge;
  }

  // Required field validation
  static isRequired(value: any): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }

  // Minimum length validation
  static hasMinLength(value: string, minLength: number): boolean {
    return value.length >= minLength;
  }

  // Maximum length validation
  static hasMaxLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength;
  }

  // Range validation for numbers
  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  // One of validation (value must be in allowed list)
  static isOneOf<T>(value: T, allowedValues: T[]): boolean {
    return allowedValues.includes(value);
  }

  // Custom regex validation
  static matchesPattern(value: string, pattern: RegExp): boolean {
    return pattern.test(value);
  }

  // File extension validation
  static hasValidExtension(fileName: string, allowedExtensions: string[]): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension ? allowedExtensions.includes(extension) : false;
  }

  // File size validation (in bytes)
  static hasValidSize(fileSize: number, maxSizeInBytes: number): boolean {
    return fileSize <= maxSizeInBytes;
  }

  // JSON validation
  static isValidJson(jsonString: string): boolean {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }

  // UUID validation
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
