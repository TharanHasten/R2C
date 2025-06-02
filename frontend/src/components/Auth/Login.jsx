import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import axios from '../../axiosInstance';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useTheme } from '../../Theme/ThemeContext.jsx';

function Login() {
  const { isDark } = useTheme();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      login(response.data.token); // Use AuthContext login
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-500 animate-fade-in-up ${
      isDark
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700'
        : 'bg-gradient-to-br from-gray-50 via-orange-50 to-amber-100'
    }`}>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl transition-all duration-500 animate-slide-in-up ${
        isDark
          ? 'bg-gray-900 border border-gray-700'
          : 'bg-white/90 border border-gray-200'
      } backdrop-blur-lg`}>
        {/* Header */}
        <div className="text-center mb-8 animate-pulse-short">
          <div className={`inline-flex p-3 rounded-xl mb-4 ${
            isDark
              ? 'bg-gradient-to-r from-orange-500 to-amber-500'
              : 'bg-gradient-to-r from-orange-600 to-amber-600'
          } transition-transform duration-300 hover:scale-110`}>
            <LogIn size={32} className="text-white" />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          } transition-colors duration-300`}>
            Welcome Back
          </h2>
          <p className={`text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          } transition-colors duration-300`}>
            Sign in to access your snippets
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`p-4 rounded-lg mb-6 flex items-center space-x-2 animate-fade-in ${
            isDark
              ? 'bg-red-900/20 border border-red-700 text-red-400'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <label className={`block text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            } transition-colors duration-300`}>
              Email Address
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              } transition-colors duration-300`}>
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                autoComplete="current-email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                  isDark
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 '
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 '
                }`}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <label className={`block text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            } transition-colors duration-300`}>
              Password
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              } transition-colors duration-300`}>
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-300${
                  isDark
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-300 ${
                  isDark ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50 animate-pulse-short ${
              isDark
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25'
                : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg shadow-orange-600/25'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <LogIn size={18} />
                <span>Sign In</span>
              </div>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <p className={`text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          } transition-colors duration-300`}>
            Don't have an account?{' '}
            <Link
              to="/register"
              className={`font-medium transition-colors duration-300 hover:underline ${
                isDark
                  ? 'text-orange-400 hover:text-orange-300'
                  : 'text-orange-500 hover:text-orange-600'
              }`}
            >
              Sign up here
            </Link>
          </p>
        </div>

        {/* Divider */}
        <div className={`mt-8 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} animate-fade-in-up`} style={{ animationDelay: '0.4s' }}>
          <p className={`text-xs text-center ${
            isDark ? 'text-gray-400' : 'text-gray-400'
          } transition-colors duration-300`}>
            Secure login with JWT authentication
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;