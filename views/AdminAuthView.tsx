import React from 'react';
// FIX: Add file extension to import to fix module resolution error.
import { LogoIcon, ArrowLeftIcon } from '../components/Icons.tsx';
// FIX: Import ValidationErrors from types.ts where it is exported, not from useFormValidation.
// FIX: Add file extension to import to fix module resolution error.
import { User, ValidationErrors } from '../types.ts';
// FIX: Add file extension to import to fix module resolution error.
import useFormValidation from '../hooks/useFormValidation.ts';


interface AdminAuthViewProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

const AdminAuthView: React.FC<AdminAuthViewProps> = ({ onLogin, onBack }) => {
    
    const validate = (values: any): ValidationErrors<any> => {
        const errors: ValidationErrors<any> = {};
        if (!values.email) {
            errors.email = 'Email is required.';
        }
        if (!values.password) {
            errors.password = 'Password is required.';
        }
        return errors;
    };

    const { values, errors, isFormValid, handleChange } = useFormValidation({
        email: '',
        password: '',
    }, validate);

    const handleLogin = () => {
        if (isFormValid) {
            if (values.email === 'admin@truecost.com' && values.password === 'password') {
                onLogin({ name: 'Admin User', email: 'admin@truecost.com', role: 'admin' });
            } else {
                // In a real app, this error would come from the backend.
                // We're not setting it in the form errors as it's not a field-specific validation error.
                alert('Invalid admin credentials.');
            }
        }
    };

  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 sm:px-6 animate-fade-in">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl relative border border-gray-200 dark:border-gray-700">
        <button onClick={onBack} className="absolute top-6 left-6 flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all hover:translate-x-1">
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back</span>
        </button>
        <div className="flex flex-col items-center space-y-3 pt-8">
          <div className="p-3 bg-gradient-to-br from-brand-primary to-blue-700 rounded-xl shadow-lg">
            <LogoIcon className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-primary to-blue-700 bg-clip-text text-transparent">
            Admin Login
          </h1>
        </div>
        
        <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div>
                <input 
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={values.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-shadow ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                 {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            <div>
                <input 
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary transition-shadow ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>
            <button
                type="submit"
                disabled={!isFormValid}
                className="w-full py-3 px-4 font-semibold text-white bg-brand-primary rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Sign In
            </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuthView;