import { VALIDATION } from '@vegan-vita-shop/shared';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
    errors.push('Invalid email format');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password || password.length === 0) {
    errors.push('Password is required');
  } else if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`);
  }
  
  // Additional password requirements
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.trim().length < VALIDATION.NAME_MIN_LENGTH) {
    errors.push(`Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters long`);
  } else if (name.trim().length > VALIDATION.NAME_MAX_LENGTH) {
    errors.push(`Name must be no more than ${VALIDATION.NAME_MAX_LENGTH} characters long`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePhone = (phone: string): ValidationResult => {
  const errors: string[] = [];
  
  if (phone && !VALIDATION.PHONE_REGEX.test(phone)) {
    errors.push('Invalid phone number format');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateRequired = (value: any, fieldName: string): ValidationResult => {
  const errors: string[] = [];
  
  if (value === null || value === undefined || (typeof value === 'string' && value.trim().length === 0)) {
    errors.push(`${fieldName} is required`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePositiveNumber = (value: number, fieldName: string): ValidationResult => {
  const errors: string[] = [];
  
  if (typeof value !== 'number' || isNaN(value)) {
    errors.push(`${fieldName} must be a valid number`);
  } else if (value <= 0) {
    errors.push(`${fieldName} must be a positive number`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};