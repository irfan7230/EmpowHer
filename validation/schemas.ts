// validation/schemas.ts
import * as yup from 'yup';

// Phone number validation regex (supports multiple formats)
const phoneRegExp = /^(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;

// Email validation (more strict)
const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Unique ID validation (10 digits)
const uniqueIdRegExp = /^\d{10}$/;

// OTP validation (6 digits)
const otpRegExp = /^\d{6}$/;

// ==================== AUTH SCHEMAS ====================

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .matches(emailRegExp, 'Please enter a valid email address')
    .email('Please enter a valid email address')
    .trim()
    .lowercase(),
});

export const signupSchema = yup.object({
  name: yup
    .string()
    .when('$isSignUp', {
      is: true,
      then: (schema) => schema
        .required('Full name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
        .trim(),
      otherwise: (schema) => schema.optional(),
    }),
  
  phone: yup
    .string()
    .when('$isSignUp', {
      is: true,
      then: (schema) => schema
        .required('Phone number is required')
        .matches(phoneRegExp, 'Please enter a valid phone number')
        .trim(),
      otherwise: (schema) => schema.optional(),
    }),
  
  email: yup
    .string()
    .required('Email is required')
    .matches(emailRegExp, 'Please enter a valid email address')
    .email('Please enter a valid email address')
    .trim()
    .lowercase(),
});

export const otpSchema = yup.object({
  otp: yup
    .string()
    .required('OTP is required')
    .matches(otpRegExp, 'OTP must be exactly 6 digits')
    .length(6, 'OTP must be exactly 6 digits'),
});

// ==================== PROFILE SCHEMAS ====================

export const profileSchema = yup.object({
  name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .trim(),
  
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(phoneRegExp, 'Please enter a valid phone number')
    .trim(),
  
  email: yup
    .string()
    .required('Email is required')
    .matches(emailRegExp, 'Please enter a valid email address')
    .email('Please enter a valid email address')
    .trim()
    .lowercase(),
  
  gender: yup
    .string()
    .oneOf(['male', 'female', 'other', 'prefer-not-to-say'], 'Please select a valid gender')
    .required('Gender is required'),
});

// ==================== TRUSTEE SCHEMAS ====================

export const trusteeSearchSchema = yup.object({
  searchQuery: yup
    .string()
    .required('Search query is required')
    .test('is-valid-contact', 'Please enter a valid email, phone, or unique ID', (value) => {
      if (!value) return false;
      
      // Check if it's a valid email
      if (emailRegExp.test(value)) return true;
      
      // Check if it's a valid phone
      if (phoneRegExp.test(value)) return true;
      
      // Check if it's a valid unique ID
      if (uniqueIdRegExp.test(value)) return true;
      
      return false;
    })
    .trim(),
});

export const trusteeManualSchema = yup.object({
  name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .trim(),
  
  phone: yup
    .string()
    .optional()
    .test('is-valid-phone', 'Please enter a valid phone number', (value) => {
      if (!value) return true; // Optional field
      return phoneRegExp.test(value);
    })
    .trim(),
  
  email: yup
    .string()
    .optional()
    .test('is-valid-email', 'Please enter a valid email address', (value) => {
      if (!value) return true; // Optional field
      return emailRegExp.test(value);
    })
    .trim()
    .lowercase(),
  
  uniqueId: yup
    .string()
    .optional()
    .test('is-valid-id', 'Unique ID must be exactly 10 digits', (value) => {
      if (!value) return true; // Optional field
      return uniqueIdRegExp.test(value);
    })
    .trim(),
  
  relationship: yup
    .string()
    .required('Relationship is required')
    .min(2, 'Relationship must be at least 2 characters')
    .max(30, 'Relationship must be less than 30 characters')
    .trim(),
})
.test('has-contact-info', 'Please provide at least phone, email, or unique ID', function(value) {
  const { phone, email, uniqueId } = value;
  return !!(phone || email || uniqueId);
});

// ==================== CHAT/MESSAGE SCHEMAS ====================

export const messageSchema = yup.object({
  text: yup
    .string()
    .required('Message cannot be empty')
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message must be less than 1000 characters')
    .trim(),
});

// ==================== COMMUNITY SCHEMAS ====================

export const safetyRatingSchema = yup.object({
  rating: yup
    .number()
    .required('Rating is required')
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating must be at most 5 stars')
    .integer('Rating must be a whole number'),
  
  comment: yup
    .string()
    .optional()
    .max(500, 'Comment must be less than 500 characters')
    .trim(),
  
  location: yup.object({
    latitude: yup
      .number()
      .required('Latitude is required')
      .min(-90, 'Invalid latitude')
      .max(90, 'Invalid latitude'),
    
    longitude: yup
      .number()
      .required('Longitude is required')
      .min(-180, 'Invalid longitude')
      .max(180, 'Invalid longitude'),
    
    address: yup
      .string()
      .required('Address is required')
      .min(5, 'Address must be at least 5 characters')
      .max(200, 'Address must be less than 200 characters')
      .trim(),
  }).required('Location is required'),
});

// ==================== SOS SCHEMAS ====================

export const sosDeactivationSchema = yup.object({
  otp: yup
    .string()
    .required('OTP is required to deactivate SOS')
    .matches(otpRegExp, 'OTP must be exactly 6 digits')
    .length(6, 'OTP must be exactly 6 digits'),
});

// ==================== HELPER FUNCTIONS ====================

/**
 * Validate and sanitize phone number
 */
export const validatePhone = (phone: string): { isValid: boolean; sanitized?: string; error?: string } => {
  const sanitized = sanitizeInput(phone).trim();
  
  if (!phoneRegExp.test(sanitized)) {
    return {
      isValid: false,
      error: 'Please enter a valid phone number',
    };
  }
  
  return {
    isValid: true,
    sanitized,
  };
};

/**
 * Validate unique ID
 */
export const validateUniqueId = (id: string): { isValid: boolean; sanitized?: string; error?: string } => {
  const sanitized = sanitizeInput(id).trim();
  
  if (!uniqueIdRegExp.test(sanitized)) {
    return {
      isValid: false,
      error: 'Unique ID must be exactly 10 digits',
    };
  }
  
  return {
    isValid: true,
    sanitized,
  };
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
};

// Validate data against a schema and return formatted errors
 
export const validateData = async <T>(
  schema: yup.Schema<T>,
  data: any,
  context?: any
): Promise<{ isValid: boolean; errors: Record<string, string>; data?: T }> => {
  try {
    const validData = await schema.validate(data, {
      abortEarly: false,
      context,
    });
    
    return {
      isValid: true,
      errors: {},
      data: validData,
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      
      return {
        isValid: false,
        errors,
      };
    }
    
    return {
      isValid: false,
      errors: { _error: 'Validation failed' },
    };
  }
};

/**
 * Validate a single field
 */
export const validateField = async (
  schema: yup.Schema<any>,
  fieldName: string,
  value: any,
  context?: any
): Promise<{ isValid: boolean; error?: string }> => {
  try {
    await schema.validateAt(fieldName, { [fieldName]: value }, { context });
    return { isValid: true };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return {
        isValid: false,
        error: error.message,
      };
    }
    return {
      isValid: false,
      error: 'Validation failed',
    };
  }
};

/**
 * Sanitize input to prevent XSS and injection attacks
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
};

/**
 * Validate and sanitize email
 */
export const validateEmail = (email: string): { isValid: boolean; sanitized?: string; error?: string } => {
  const sanitized = sanitizeInput(email).toLowerCase().trim();
  
  if (!emailRegExp.test(sanitized)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }
  
  return {
    isValid: true,
    sanitized,
  };
};
