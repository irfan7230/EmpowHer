import { useState, useCallback } from 'react';
import * as yup from 'yup';
import { validateData, validateField } from '@/validation/schemas';

interface UseValidatedFormOptions<T> {
  schema: yup.Schema<T>;
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  context?: any;
}

interface FormState<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValidating: boolean;
}

export function useValidatedForm<T extends Record<string, any>>({
  schema,
  initialValues,
  onSubmit,
  validateOnChange = false,
  validateOnBlur = true,
  context,
}: UseValidatedFormOptions<T>) {
  const [formState, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValidating: false,
  });

  // Set field value
  const setFieldValue = useCallback(
    async (field: keyof T, value: any) => {
      setFormState((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          [field]: value,
        },
      }));

      // Validate on change if enabled
      if (validateOnChange) {
        setFormState((prev) => ({ ...prev, isValidating: true }));
        
        const result = await validateField(schema, field as string, value, context);
        
        setFormState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            [field]: result.error || '',
          },
          isValidating: false,
        }));
      }
    },
    [schema, validateOnChange]
  );

  // Set multiple field values
  const setFieldValues = useCallback((values: Partial<T>) => {
    setFormState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        ...values,
      },
    }));
  }, []);

  // Mark field as touched
  const setFieldTouched = useCallback(
    async (field: keyof T, touched = true) => {
      setFormState((prev) => ({
        ...prev,
        touched: {
          ...prev.touched,
          [field]: touched,
        },
      }));

      // Validate on blur if enabled
      if (validateOnBlur && touched) {
        setFormState((prev) => ({ ...prev, isValidating: true }));
        
        const result = await validateField(
          schema,
          field as string,
          formState.values[field],
          context
        );
        
        setFormState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            [field]: result.error || '',
          },
          isValidating: false,
        }));
      }
    },
    [schema, validateOnBlur, formState.values]
  );

  // Set field error manually
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setFormState((prev) => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: error,
      },
    }));
  }, []);

  // Clear field error
  const clearFieldError = useCallback((field: keyof T) => {
    setFormState((prev) => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: '',
      },
    }));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      errors: {},
    }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValidating: false,
    });
  }, [initialValues]);

  // Validate entire form
  const validate = useCallback(async () => {
    setFormState((prev) => ({ ...prev, isValidating: true }));
    
    const result = await validateData(schema, formState.values, context);
    
    setFormState((prev) => ({
      ...prev,
      errors: result.errors,
      isValidating: false,
    }));
    
    return result;
  }, [schema, formState.values, context]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: any) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // Mark all fields as touched
      const allTouched = Object.keys(formState.values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      
      setFormState((prev) => ({
        ...prev,
        touched: allTouched,
        isSubmitting: true,
      }));

      // Validate
      const result = await validate();

      if (!result.isValid) {
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
        }));
        return;
      }

      // Submit
      try {
        await onSubmit(result.data!);
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
        }));
      } catch (error) {
        console.error('Form submission error:', error);
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          errors: {
            ...prev.errors,
            _submit: error instanceof Error ? error.message : 'Submission failed',
          },
        }));
      }
    },
    [formState.values, validate, onSubmit]
  );

  // Get field props for easy integration
  const getFieldProps = useCallback(
    (field: keyof T) => {
      const key = field as unknown as string;
      return {
        value: formState.values[field],
        onChangeText: (value: any) => setFieldValue(field, value),
        onBlur: () => setFieldTouched(field, true),
        error: formState.touched[key] ? formState.errors[key] : undefined,
      };
    },
    [formState, setFieldValue, setFieldTouched]
  );

  // Check if form is valid
  const isValid = Object.keys(formState.errors).length === 0;

  // Check if form has been modified
  const isDirty = JSON.stringify(formState.values) !== JSON.stringify(initialValues);

  return {
    values: formState.values,
    errors: formState.errors,
    touched: formState.touched,
    isSubmitting: formState.isSubmitting,
    isValidating: formState.isValidating,
    isValid,
    isDirty,
    setFieldValue,
    setFieldValues,
    setFieldTouched,
    setFieldError,
    clearFieldError,
    clearErrors,
    resetForm,
    validate,
    handleSubmit,
    getFieldProps,
  };
}