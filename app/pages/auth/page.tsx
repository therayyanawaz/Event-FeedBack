'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import AuthForm from '../../components/AuthForm';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const redirectTo = searchParams.get('redirectTo') || '/';

  const handleSuccess = () => {
    router.push(redirectTo);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          Event Feedback
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          {mode === 'login' 
            ? 'Sign in to your account to access your dashboard'
            : 'Create a new account to get started'
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <AuthForm defaultMode={mode} onSuccess={handleSuccess} />
      </div>
    </div>
  );
} 