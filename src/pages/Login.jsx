import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckSquare, Loader2 } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 auth-bg transition-all duration-300">
      <div className="w-full max-w-md rounded-2xl border glass dark:glass-dark border-zinc-200 dark:border-zinc-800 shadow-sm p-8">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-600 text-white shadow-sm mb-4">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Welcome back</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Sign in to your ZenTask account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-250/30 dark:border-rose-900/30 text-rose-500 dark:text-rose-455 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Email/Username */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-2">
              Email or Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700/65 bg-white/50 dark:bg-slate-900/30 text-slate-800 dark:text-white form-input-focus"
                id="login-email-input"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700/65 bg-white/50 dark:bg-slate-900/30 text-slate-800 dark:text-white form-input-focus"
                id="login-password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                id="login-password-toggle"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold transition shadow-sm flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            id="login-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center text-sm text-slate-550 dark:text-slate-400 border-t border-slate-100 dark:border-slate-850/40 pt-5">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-350 transition" id="to-register-link">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
