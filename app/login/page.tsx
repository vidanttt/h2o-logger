"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to main app
        router.push('/dashboard');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            💧✨ H2O LOGGER ✨💧
          </h1>
          <p className="text-pink-300">Hydration companion for pookie</p>
        </div>

        {/* Login/Register Form */}
        <div className="bg-gray-900 rounded-xl p-8 shadow-lg border border-pink-500/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white">
              {isLogin ? "Welcome Back! 🌟" : "Join the Hydration Journey! ✨"}
            </h2>
            <p className="text-gray-300 mt-2">
              {isLogin ? "Ready to track your water intake?" : "Start your beautiful hydration habit"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-300 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
                  Full Name 👤
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full p-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent placeholder-gray-400"
                  placeholder="Enter your beautiful name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                Email Address 💌
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full p-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent placeholder-gray-400"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                Password 🔒
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                className="w-full p-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent placeholder-gray-400"
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </div>
              ) : (
                isLogin ? "Sign In ✨" : "Create Account 🌟"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              {isLogin ? "New to H2O Logger?" : "Already have an account?"}{" "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setFormData({ name: "", email: "", password: "" });
                }}
                className="text-pink-400 hover:text-pink-300 font-medium underline"
              >
                {isLogin ? "Create an account" : "Sign in instead"}
              </button>
            </p>
          </div>
        </div>

        {/* Features Preview */}
        {/* <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Why H2O Logger? 💫
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-gray-600">Track daily intake</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-gray-600">Set & achieve goals</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-gray-600">View history</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">✨</div>
              <p className="text-gray-600">Stay motivated</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
