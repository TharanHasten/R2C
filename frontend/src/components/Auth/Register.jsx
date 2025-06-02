import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import axios from '../../axiosInstance';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useTheme } from '../../Theme/ThemeContext.jsx';

function Register() {
  const { isDark } = useTheme();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    const checks = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /\d/.test(pass)
    };
    return checks;
  };

  const passwordChecks = validatePassword(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!Object.values(passwordChecks).every(check => check)) {
      setError('Password does not meet requirements');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password
      });

      // Show success message briefly
      setSuccess(true);
      setError('');
      
      // Auto-login and redirect after successful registration
      setTimeout(() => {
        login(response.data.token);
        navigate('/dashboard');
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setSuccess(false);
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
            <UserPlus size={32} className="text-white" />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          } transition-colors duration-300`}>
            Create Account
          </h2>
          <p className={`text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          } transition-colors duration-300`}>
            Join thousands of developers
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className={`p-4 rounded-lg mb-6 flex items-center space-x-2 animate-fade-in ${
            isDark
              ? 'bg-green-900/20 border border-green-700 text-green-400'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            <CheckCircle size={18} />
            <span className="text-sm">Account created successfully!</span>
          </div>
        )}

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
          {/* Username Field */}
          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <label className={`block text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            } transition-colors duration-300`}>
              Username
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              } transition-colors duration-300`}>
                <User size={18} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                  isDark
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 '
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 '
                }`}
                placeholder="Choose a username"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
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
                autoComplete="email"
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
          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
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
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-300 ${
                  isDark
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Create a strong password"
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

            {/* Password Requirements */}
            {password && (
              <div className={`p-3 rounded-lg transition-all duration-300 ${
                isDark ? 'bg-gray-800/50' : 'bg-gray-50'
              }`}>
                <p className={`text-xs font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Password Requirements:
                </p>
                <div className="space-y-1">
                  {Object.entries({
                    'At least 8 characters': passwordChecks.length,
                    'One uppercase letter': passwordChecks.uppercase,
                    'One lowercase letter': passwordChecks.lowercase,
                    'One number': passwordChecks.number
                  }).map(([requirement, met]) => (
                    <div key={requirement} className="flex items-center space-x-2">
                      <CheckCircle 
                        size={14} 
                        className={`transition-colors duration-200 ${met ? 'text-green-500' : 'text-gray-400'}`} 
                      />
                      <span className={`text-xs transition-colors duration-200 ${met ? 'text-green-500' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {requirement}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <label className={`block text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            } transition-colors duration-300`}>
              Confirm Password
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              } transition-colors duration-300`}>
                <Lock size={18} />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                autoComplete="new-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-300 ${
                  isDark
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-300 ${
                  isDark ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className="flex items-center space-x-2">
                <CheckCircle 
                  size={14} 
                  className={`transition-colors duration-200 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`} 
                />
                <span className={`text-xs transition-colors duration-200 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                  {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !passwordsMatch || !Object.values(passwordChecks).every(check => check) || !username || !email}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50 animate-pulse-short ${
              isDark
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25'
                : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg shadow-orange-600/25'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <UserPlus size={18} />
                <span>Create Account</span>
              </div>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <p className={`text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          } transition-colors duration-300`}>
            Already have an account?{' '}
            <Link
              to="/login"
              className={`font-medium transition-colors duration-300 hover:underline ${
                isDark
                  ? 'text-orange-400 hover:text-orange-300'
                  : 'text-orange-500 hover:text-orange-600'
              }`}
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Divider */}
        <div className={`mt-8 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} animate-fade-in-up`} style={{ animationDelay: '0.6s' }}>
          <p className={`text-xs text-center ${
            isDark ? 'text-gray-400' : 'text-gray-400'
          } transition-colors duration-300`}>
            By creating an account, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;