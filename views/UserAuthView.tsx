import React, { useState } from 'react';
// FIX: Add file extension to import to fix module resolution error.
import { LogoIcon, ArrowLeftIcon } from '../components/Icons.tsx';
// FIX: Import ValidationErrors from types.ts where it is exported, not from useFormValidation.
// FIX: Add file extension to import to fix module resolution error.
import { User, ValidationErrors } from '../types.ts';
// FIX: Add file extension to import to fix module resolution error.
import useFormValidation from '../hooks/useFormValidation.ts';

interface UserAuthViewProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

type AuthMode = 'signin' | 'signup';

const UserAuthView: React.FC<UserAuthViewProps> = ({ onLogin, onBack }) => {
  const [mode, setMode] = useState<AuthMode>('signin');

  const validate = (values: any): ValidationErrors<any> => {
        const errors: ValidationErrors<any> = {};

        // Validate email for both modes
        if (!values.email) {
            errors.email = 'Email address is required.';
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = 'Email address is invalid.';
        }

        // Validate password for both modes
        if (!values.password) {
            errors.password = 'Password is required.';
        }

        // Sign Up specific validation
        if (mode === 'signup') {
            if (!values.fullName) {
                errors.fullName = 'Full name is required.';
            }

            // More detailed password checks for sign up
            if (values.password && values.password.length < 6) {
                errors.password = 'Password must be at least 6 characters.';
            }

            if (!values.confirmPassword) {
                errors.confirmPassword = 'Please confirm your password.';
            } else if (values.password !== values.confirmPassword) {
                errors.confirmPassword = 'Passwords do not match.';
            }
        }
        
        return errors;
    };
    
  const { values, errors, isFormValid, handleChange } = useFormValidation({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
  }, (v) => validate(v));


  const handleAuth = () => {
    if (isFormValid) {
        if (mode === 'signup') {
            onLogin({ name: values.fullName, email: values.email, role: 'user' });
        } else {
            // In a real app, you'd fetch the user's name from the backend on sign-in
            onLogin({ name: 'Valued User', email: values.email, role: 'user' });
        }
    }
  };

  const renderInput = (name: string, type: string, placeholder: string) => (
    <div>
        <input 
            type={type}
            name={name}
            placeholder={placeholder}
            value={(values as any)[name]}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-shadow ${ (errors as any)[name] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
        />
        {(errors as any)[name] && <p className="mt-1 text-sm text-red-500">{(errors as any)[name]}</p>}
    </div>
  );

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 animate-fade-in">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl relative border border-gray-200 dark:border-gray-700">
        <button onClick={onBack} className="absolute top-6 left-6 flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all hover:translate-x-1">
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back</span>
        </button>
        <div className="flex flex-col items-center space-y-3 pt-8">
          <div className="p-3 bg-gradient-to-br from-brand-secondary to-green-700 rounded-xl shadow-lg">
            <LogoIcon className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-secondary to-green-700 bg-clip-text text-transparent">
            User Account
          </h1>
        </div>
        
        <div>
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button 
                    onClick={() => setMode('signin')}
                    className={`w-full py-3 text-sm font-medium transition-colors outline-none ${mode === 'signin' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    Sign In
                </button>
                <button
                    onClick={() => setMode('signup')}
                    className={`w-full py-3 text-sm font-medium transition-colors outline-none ${mode === 'signup' ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    Sign Up
                </button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); handleAuth(); }}>
                {mode === 'signup' && renderInput('fullName', 'text', 'Full Name')}
                {renderInput('email', 'email', 'Email Address')}
                {renderInput('password', 'password', 'Password')}
                {mode === 'signup' && renderInput('confirmPassword', 'password', 'Confirm Password')}
                 <button
                    type="submit"
                    disabled={!isFormValid}
                    className="w-full py-3 px-4 font-semibold text-white bg-brand-secondary rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default UserAuthView;