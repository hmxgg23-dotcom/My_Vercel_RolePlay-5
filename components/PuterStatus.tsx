import React, { useEffect, useState } from 'react';
import { User, Coins, Loader2, CheckCircle, LogOut } from 'lucide-react';

declare const puter: any;

interface PuterUser {
  username?: string;
  email?: string;
  [key: string]: any;
}

export const PuterStatus: React.FC = () => {
  const [user, setUser] = useState<PuterUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    setLoading(true);
    setError(null);

    try {
      if (typeof puter === 'undefined') {
        throw new Error('Puter SDK not loaded');
      }

      const userData = await puter.auth.getUser();
      setUser(userData);
    } catch (err) {
      console.error('Failed to fetch Puter user info:', err);
      setError('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      if (typeof puter === 'undefined') {
        throw new Error('Puter SDK not loaded');
      }

      await puter.auth.signOut();
      setUser(null);
      setError('Not authenticated');
    } catch (err) {
      console.error('Failed to logout:', err);
      alert('Failed to logout. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded text-xs">
        <Loader2 size={14} className="animate-spin text-zinc-500" />
        <span className="text-zinc-500">Connecting to Puter...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900/50 border border-zinc-800 rounded text-xs">
        <User size={14} className="text-zinc-600" />
        <span className="text-zinc-600">Not connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 bg-emerald-950/20 border border-emerald-900/50 rounded text-xs">
      <div className="flex items-center gap-2">
        <CheckCircle size={14} className="text-emerald-500" />
        <span className="text-emerald-400 font-medium">
          {user.username || user.email || 'Connected'}
        </span>
      </div>
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="p-1 text-zinc-500 hover:text-red-500 hover:bg-red-950/30 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Sign out"
      >
        {loggingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
      </button>
    </div>
  );
};
