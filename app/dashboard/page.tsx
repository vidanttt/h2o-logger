"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

interface WaterRecord {
  id: string;
  date: string;
  fullBottles: number;
  halfBottles: number;
  totalBottles: number;
  totalML: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [todayBottles, setTodayBottles] = useState(0);
  const [todayHalfBottles, setTodayHalfBottles] = useState(0);
  const [history, setHistory] = useState<WaterRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"today" | "history">("today");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    loadTodayData();
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const loadTodayData = useCallback(async () => {
    try {
      const response = await fetch('/api/water', {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setTodayBottles(data.fullBottles);
        setTodayHalfBottles(data.halfBottles);
      } else if (response.status === 401) {
        logout();
      }
    } catch (error) {
      console.error('Error loading today data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const response = await fetch('/api/water/history', {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else if (response.status === 401) {
        logout();
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, []);

  const updateWaterIntake = useCallback(async () => {
    try {
      const response = await fetch('/api/water', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          fullBottles: todayBottles,
          halfBottles: todayHalfBottles,
        }),
      });

      if (!response.ok && response.status === 401) {
        logout();
      }
    } catch (error) {
      console.error('Error updating water intake:', error);
    }
  }, [todayBottles, todayHalfBottles]);

  useEffect(() => {
    if (!loading) {
      updateWaterIntake();
    }
  }, [todayBottles, todayHalfBottles, loading, updateWaterIntake]);

  const addFullBottle = () => {
    setTodayBottles(prev => prev + 1);
  };

  const addHalfBottle = () => {
    setTodayHalfBottles(prev => prev + 1);
  };

  const removeFullBottle = () => {
    setTodayBottles(prev => Math.max(0, prev - 1));
  };

  const removeHalfBottle = () => {
    setTodayHalfBottles(prev => Math.max(0, prev - 1));
  };

  const getTotalBottles = () => {
    return todayBottles + (todayHalfBottles * 0.5);
  };

  const getWaterInML = () => {
    return getTotalBottles() * 500;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-pink-400 text-lg">Loading your hydration data... ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            💧✨ H2O Logger ✨💧
          </h1>
          <p className="text-pink-300">Stay hydrated, stay beautiful! 💖</p>
          
          {/* User Info */}
          {user && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-lg font-medium text-white">
                  {user.name}&apos;s Water Journey
                </span>
              </div>
              <button
                onClick={logout}
                className="text-sm text-gray-400 hover:text-gray-300 underline"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-6 bg-gray-900 rounded-lg p-1 shadow-md border border-pink-500/20">
          <button
            onClick={() => setActiveTab("today")}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === "today"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm"
                : "text-pink-400 hover:bg-gray-800"
            }`}
          >
            💧 Today
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
              activeTab === "history"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm"
                : "text-pink-400 hover:bg-gray-800"
            }`}
          >
            📊 History
          </button>
        </div>

        {/* Today Tab */}
        {activeTab === "today" && (
          <div className="space-y-6">
            {/* Today's Progress */}
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-pink-500/20">
              <h2 className="text-xl font-semibold text-white mb-4 text-center">
                Today&apos;s Hydration Journey 🌟
              </h2>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {getTotalBottles()} bottles
                </div>
                <div className="text-lg text-pink-300">
                  {getWaterInML()}ml of pure hydration ✨
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Full bottles: {todayBottles} 🥤 | Half bottles: {todayHalfBottles} 🥛
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-4 mb-6">
                <div
                  className="bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-500 h-4 rounded-full transition-all duration-500 ease-out relative"
                  style={{
                    width: `${Math.min((getTotalBottles() / 8) * 100, 100)}%`
                  }}
                >
                  {getTotalBottles() >= 8 && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-xs font-bold">
                      🎉
                    </div>
                  )}
                </div>
              </div>
              <div className="text-center text-sm text-gray-400">
                Daily Goal: 8 bottles (4000ml) 💖
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Full Bottle Section */}
              <div className="bg-gray-900 rounded-xl p-4 shadow-lg border border-pink-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🥤</span>
                    <div>
                      <div className="font-semibold text-white">Full Bottle</div>
                      <div className="text-sm text-gray-400">500ml</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={removeFullBottle}
                      disabled={todayBottles === 0}
                      className="w-10 h-10 bg-red-900/50 hover:bg-red-800/50 disabled:bg-gray-800 disabled:text-gray-600 text-red-400 rounded-full font-bold transition-all"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold text-white min-w-[2rem] text-center">
                      {todayBottles}
                    </span>
                    <button
                      onClick={addFullBottle}
                      className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full font-bold transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Half Bottle Section */}
              <div className="bg-gray-900 rounded-xl p-4 shadow-lg border border-purple-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🥛</span>
                    <div>
                      <div className="font-semibold text-white">Half Bottle</div>
                      <div className="text-sm text-gray-400">250ml</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={removeHalfBottle}
                      disabled={todayHalfBottles === 0}
                      className="w-10 h-10 bg-red-900/50 hover:bg-red-800/50 disabled:bg-gray-800 disabled:text-gray-600 text-red-400 rounded-full font-bold transition-all"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold text-white min-w-[2rem] text-center">
                      {todayHalfBottles}
                    </span>
                    <button
                      onClick={addHalfBottle}
                      className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-full font-bold transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="bg-gradient-to-r from-pink-900/30 via-purple-900/30 to-cyan-900/30 rounded-xl p-4 text-center border border-pink-500/30">
              <div className="text-lg font-medium text-pink-300">
                {getTotalBottles() >= 8 
                  ? "🎉 Amazing! You&apos;re a hydration queen! Keep glowing! ✨"
                  : getTotalBottles() >= 6
                    ? "💖 You&apos;re doing fantastic! Almost there, beautiful!"
                    : getTotalBottles() >= 4
                      ? "🌟 Great progress! You&apos;re halfway to your glow goal!"
                      : getTotalBottles() >= 2
                        ? "💫 Good start! Your skin will thank you!"
                        : "🌸 Time to start your hydration journey, gorgeous!"}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-purple-500/20">
              <h2 className="text-xl font-semibold text-white mb-4 text-center">
                Your Hydration History ✨
              </h2>
              
              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-4">📊💖</div>
                  <p>No history yet, beautiful! Start your hydration journey today! 🌸</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.map((record) => (
                    <div
                      key={record.id}
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-pink-900/20 to-purple-900/20 rounded-lg border border-pink-500/20"
                    >
                      <div>
                        <div className="font-medium text-white">
                          {new Date(record.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-pink-300">
                          {record.fullBottles} full 🥤 + {record.halfBottles} half 🥛
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-purple-400">
                          {record.totalBottles} bottles
                        </div>
                        <div className="text-sm text-gray-400">
                          {record.totalML}ml ✨
                        </div>
                        {record.totalBottles >= 8 && (
                          <div className="text-xs text-pink-400 font-medium">
                            Goal achieved! 🎉
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
