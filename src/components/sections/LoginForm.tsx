import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Button from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';

const INPUT_CLASS =
  'w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

export default function LoginForm() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const showToast = useUIStore((s) => s.showToast);

  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated());
  useEffect(() => useAuthStore.persist.onFinishHydration(() => setHydrated(true)), []);

  useEffect(() => {
    if (hydrated && isAuthenticated) navigate('/dashboard', { replace: true });
  }, [hydrated, isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [tab, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register(firstName.trim(), lastName.trim(), email, password, phone.trim() || undefined);
      }
    } catch {
      // error is exposed via authStore; nothing else to do here
    }
  };

  const handleGoogleSuccess = async (credential: string | undefined) => {
    if (!credential) {
      showToast('Google sign-in failed', 'error');
      return;
    }
    try {
      await loginWithGoogle(credential);
    } catch {
      // surfaced via store error
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-3 h-3 rounded-full bg-primary" />
        <span className="text-lg font-bold text-slate-900">UniScoot</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
      <p className="text-sm text-slate-500 mb-8">Enter your details to continue riding</p>

      <div className="flex bg-slate-100 rounded-lg p-1 mb-6" role="tablist" aria-label="Auth mode">
        <button
          onClick={() => setTab('login')}
          role="tab"
          aria-selected={tab === 'login'}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            tab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
          }`}
        >
          Log in
        </button>
        <button
          onClick={() => setTab('register')}
          role="tab"
          aria-selected={tab === 'register'}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            tab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === 'register' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  First Name
                </label>
                <input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  autoComplete="given-name"
                  required
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Last Name
                </label>
                <input
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  autoComplete="family-name"
                  required
                  className={INPUT_CLASS}
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                Phone Number <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 123 4567"
                autoComplete="tel"
                className={INPUT_CLASS}
              />
            </div>
          </>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@university.edu"
            autoComplete="email"
            required
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            {tab === 'login' && (
              <button type="button" className="text-xs text-primary hover:text-primary-dark cursor-pointer">
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              required
              className={`${INPUT_CLASS} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">{error}</p>
        )}
        <Button type="submit" fullWidth size="lg" disabled={loading}>
          {loading ? 'Please wait...' : tab === 'login' ? 'Continue to Dashboard' : 'Create Account'}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400">or continue with</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={(r) => handleGoogleSuccess(r.credential)}
          onError={() => showToast('Google sign-in failed', 'error')}
          useOneTap={false}
          width="320"
        />
      </div>

      <p className="text-xs text-slate-400 text-center mt-8">
        By continuing, you agree to UniScoot's{' '}
        <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
        <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
      </p>

      <div className="text-center mt-4">
        <Link to="/" className="text-xs text-slate-500 hover:text-slate-700">
          Back to home
        </Link>
      </div>
    </div>
  );
}
