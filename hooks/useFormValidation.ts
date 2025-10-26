import React, { useState, useCallback, useEffect } from 'react';
// FIX: Add file extension to import to fix module resolution error.
import { ValidationErrors } from '../types.ts';

interface UseFormValidation<T> {
  values: T;
  errors: ValidationErrors<T>;
  isFormValid: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValues: React.Dispatch<React.SetStateAction<T>>;
}

const useFormValidation = <T extends Record<string, any>>(
  initialState: T,
  validate: (values: T) => ValidationErrors<T>
): UseFormValidation<T> => {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setIsFormValid(Object.keys(validationErrors).length === 0);
  }, [values]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }, []);

  return { values, errors, isFormValid, handleChange, setValues };
};

export default useFormValidation;