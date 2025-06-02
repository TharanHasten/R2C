import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, Menu, X, User, LogOut, Home, Star, Archive, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useTheme } from '../Theme/ThemeContext.jsx';

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = isAuthenticated ? [
    { to: '/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    { to: '/mysnippet', label: 'My Snippets', icon: <Code2 size={18} /> },
    { to: '/collection', label: 'Collection', icon: <Archive size={18} /> }, // Allow access to Collection
    { to: '/profile', label: 'Profile', icon: <User size={18} /> },
  ] : [
    { to: '/', label: 'Home', icon: <Home size={18} /> },
    { to: '/features', label: 'Features', icon: <Star size={18} /> },
    { to: '/collection', label: 'Collection', icon: <Archive size={18} /> },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isDark 
        ? 'bg-gray-900/95 border-gray-700/50' 
        : 'bg-white/95 border-gray-200/50'
    } backdrop-blur-lg border-b shadow-sm`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
      <Link
      to={isAuthenticated ? '/dashboard' : '/'}
      className={`flex items-center space-x-2 sm:space-x-3 font-bold text-lg sm:text-xl transition-all duration-300 group ${
        isDark
          ? 'text-white hover:text-orange-400'
          : 'text-gray-900 hover:text-orange-600'
      }`}
      >
            <div className={`p-1.5 sm:p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
              isDark 
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25' 
                : 'bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg shadow-orange-600/25'
            }`}>
              <Code2 size={18} className="text-white" />
            </div>
            <span className="hidden xs:block sm:text-xl">R2C</span>
          </Link>


          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg font-medium transition-all duration-300 relative overflow-hidden group ${
                  isActivePath(link.to)
                    ? isDark
                      ? 'bg-orange-500/90 text-white shadow-lg shadow-orange-500/25'
                      : 'bg-orange-600/90 text-white shadow-lg shadow-orange-600/25'
                    : isDark
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800/80'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                }`}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  {link.icon}
                  <span className="text-sm xl:text-base">{link.label}</span>
                </span>
                {!isActivePath(link.to) && (
                  <div className={`absolute inset-0 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                    isDark
                      ? 'bg-gradient-to-r from-orange-500/10 to-amber-500/10'
                      : 'bg-gradient-to-r from-orange-600/10 to-amber-600/10'
                  }`} />
                )}
              </Link>
            ))}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 xl:p-2.5 rounded-lg transition-all duration-300 group ${
                isDark 
                  ? 'text-gray-300 hover:text-orange-400 hover:bg-gray-800/80' 
                  : 'text-gray-600 hover:text-orange-600 hover:bg-gray-100/80'
              }`}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun size={20} className="group-hover:rotate-12 transition-transform duration-300" />
              ) : (
                <Moon size={20} className="group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
                  isDark
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                    : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                }`}
              >
                <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                <span className="text-sm xl:text-base">Logout</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 xl:space-x-3 ml-4">
                <Link
                  to="/login"
                  className={`px-3 xl:px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isDark
                      ? 'text-gray-300 hover:text-white hover:bg-gray-800/80'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                  }`}
                >
                  <span className="text-sm xl:text-base">Login</span>
                </Link>
                <Link
                  to="/register"
                  className={`px-3 xl:px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 group ${
                    isDark
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40'
                      : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg shadow-orange-600/25 hover:shadow-orange-600/40'
                  }`}
                >
                  <span className="text-sm xl:text-base group-hover:scale-105 transition-transform duration-300">Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
              isDark 
                ? 'text-gray-300 hover:text-orange-400 hover:bg-gray-800/80' 
                : 'text-gray-600 hover:text-orange-600 hover:bg-gray-100/80'
            }`}
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-6 h-6">
              <Menu 
                size={24} 
                className={`absolute inset-0 transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                }`} 
              />
              <X 
                size={24} 
                className={`absolute inset-0 transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
                }`} 
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-screen opacity-100 pb-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className={`pt-4 border-t ${
            isDark ? 'border-gray-700/50' : 'border-gray-200/50'
          }`}>
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActivePath(link.to)
                      ? isDark
                        ? 'bg-orange-500/90 text-white shadow-lg shadow-orange-500/25'
                        : 'bg-orange-600/90 text-white shadow-lg shadow-orange-600/25'
                      : isDark
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800/80'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Mobile Theme Toggle */}
              <button
                onClick={() => {
                  toggleTheme();
                  closeMobileMenu();
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 w-full text-left ${
                  isDark 
                    ? 'text-gray-300 hover:text-orange-400 hover:bg-gray-800/80' 
                    : 'text-gray-600 hover:text-orange-600 hover:bg-gray-100/80'
                }`}
              >
                {isDark ? (
                  <>
                    <Sun size={18} />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={18} />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              {/* Mobile Auth Section */}
              <div className={`pt-3 mt-3 border-t ${
                isDark ? 'border-gray-700/50' : 'border-gray-200/50'
              }`}>
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 w-full text-left ${
                      isDark
                        ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
                        : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                    }`}
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 text-center ${
                        isDark
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800/80 border border-gray-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 border border-gray-300'
                      }`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 text-center ${
                        isDark
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                          : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-600/25'
                      }`}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;