import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, signup, error, clearError, isLoading } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    try {
      if (isSignup) {
        if (!name.trim()) {
          setLocalError('Name is required');
          return;
        }
        await signup(email, name, password);
      } else {
        await login(email, password);
      }
    } catch {
      // Error is handled by AuthContext
    }
  };

  const handleDemoLogin = async () => {
    setLocalError('');
    clearError();
    try {
      await login('demo@shipnow.com', 'demo123');
    } catch {
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2">
          <div className="text-primary">
            <span className="material-symbols-outlined text-4xl font-bold">bolt</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">SHIPNOW</span>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          {isSignup ? 'Create your account' : 'Sign in to your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Export Invoice Management Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSignup && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={isSignup}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {(error || localError) && (
              <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <span className="material-symbols-outlined text-red-400 text-sm">error</span>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error || localError}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {isSignup ? 'Creating account...' : 'Signing in...'}
                  </span>
                ) : (
                  isSignup ? 'Create account' : 'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined text-sm">play_circle</span>
                Try Demo Account
              </button>
              <p className="mt-2 text-center text-xs text-gray-500">
                demo@shipnow.com / demo123
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                clearError();
                setLocalError('');
              }}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              {isSignup
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
