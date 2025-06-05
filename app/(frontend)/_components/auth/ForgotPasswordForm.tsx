'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { requestPasswordResetAction } from '@/app/(frontend)/_actions/auth';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(''); // For displaying messages directly in the form if needed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(''); // Clear previous messages
    const toastId = toast.loading('Processing your request...');

    const result = await requestPasswordResetAction(email);

    if (result.success) {
      toast.success(result.message, { id: toastId, duration: 5000 });
      setMessage(result.message); 
    } else {
      toast.error(result.message, { id: toastId, duration: 5000 });
      setMessage(result.message); 
    }
    setIsLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-white mb-1">
            EMAIL<span className="text-pink-400">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Your email address"
            className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/60 focus:outline-none focus:border-blue-400 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#5B5BF6] hover:bg-[#3c3cd1] text-white font-semibold rounded-lg py-2.5 mt-4 transition-colors text-lg shadow-md"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-sm text-center ${message.includes('error') ? 'text-red-400' : 'text-green-400'}`}
        >
          {message}
        </p>
      )}
      <div className="text-center mt-6 w-full">
        <Link href="/login" className="text-sm text-white/80 hover:text-white hover:underline">
          Back to Login
        </Link>
      </div>
    </>
  );
}
