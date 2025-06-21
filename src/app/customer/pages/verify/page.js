'use client';
// src/app/customer/pages/verify/page.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VerifyPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isRequestSent = false;

    async function verifyEmail() {
      if (isRequestSent) return;
      isRequestSent = true;

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/verify?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          toast.success(data.message || 'Email verified successfully!');
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Verification error:', error);
        setLoading(false);
      }
    }

    verifyEmail();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <ToastContainer />
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full text-center">
        <h1 className="text-3xl font-semibold mb-4 text-gray-800">Email Verification</h1>
        <p className="text-gray-600 mb-6">Please wait while we verify your email.</p>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <p className="text-[#FF0000]">Verification failed or token not found.</p>
        )}
      </div>
    </div>
  );
}
