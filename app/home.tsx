"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
        <p className="text-purple-600 text-lg">Loading H2O Logger... ✨</p>
      </div>
    </div>
  );
}
