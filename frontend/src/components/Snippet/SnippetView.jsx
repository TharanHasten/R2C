import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { X, Code2, Tag, Globe, Lock, AlertCircle, Loader2, Copy, Check } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useTheme } from '../../Theme/ThemeContext.jsx';

function SnippetView() {
  const { isDark } = useTheme();
  const { isAuthenticated } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [snippet, setSnippet] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchSnippet = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.get(`/api/snippets/${id}`, {
          headers: isAuthenticated ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {},
        });
        setSnippet(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load snippet');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSnippet();
  }, [id, isAuthenticated]);

  const handleClose = () => {
    const fromList = location.state?.fromList;
    navigate(fromList ? '/mysnippet' : '/collection', { state: { fromView: true } });
  };

  const handleCopy = () => {
    if (snippet?.code) {
      navigator.clipboard.writeText(snippet.code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }
  };

  const getLanguageColor = (language) => {
    const colors = {
      javascript: isDark ? 'bg-yellow-900/30 text-yellow-400 border-yellow-600/30' : 'bg-yellow-100 text-yellow-800 border-yellow-200',
      python: isDark ? 'bg-blue-900/30 text-blue-400 border-blue-600/30' : 'bg-blue-100 text-blue-800 border-blue-200',
      java: isDark ? 'bg-red-900/30 text-red-400 border-red-600/30' : 'bg-red-100 text-red-800 border-red-200',
      css: isDark ? 'bg-blue-900/30 text-blue-400 border-blue-600/30' : 'bg-blue-100 text-blue-800 border-blue-200',
      html: isDark ? 'bg-orange-900/30 text-orange-400 border-orange-600/30' : 'bg-orange-100 text-orange-800 border-orange-200',
      react: isDark ? 'bg-cyan-900/30 text-cyan-400 border-cyan-600/30' : 'bg-cyan-100 text-cyan-800 border-cyan-200',
      default: isDark ? 'bg-gray-900/30 text-gray-400 border-gray-600/30' : 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[language?.toLowerCase()] || colors.default;
  };

  const cardBg = isDark ? 'bg-gray-800/50' : 'bg-white';
  const cardBorder = isDark ? 'border-gray-700' : 'border-orange-100';

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm transition-all duration-300 animate-fade-in-up ${
      isDark ? 'bg-opacity-60' : 'bg-opacity-50'
    }`}>
 <div className={`relative ${cardBg} rounded-3xl p-6 sm:p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border ${cardBorder} backdrop-blur-sm`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
            isDark ? 'text-gray-300 hover:text-orange-400 hover:bg-gray-800' : 'text-gray-600 hover:text-orange-500 hover:bg-gray-100'
          }`}
        >
          <X size={20} />
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 size={48} className={`animate-spin mb-4 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                Loading snippet...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className={`p-4 rounded-lg flex items-center space-x-2 animate-fade-in ${
            isDark ? 'bg-red-900/20 border border-red-700 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        ) : snippet ? (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <div className={`inline-flex p-3 rounded-xl mb-4 ${
                isDark ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gradient-to-r from-orange-600 to-amber-600'
              } transition-transform duration-300 hover:scale-110`}>
                <Code2 size={28} className="text-white" />
              </div>
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
                {snippet.title}
              </h2>
            </div>

            {/* Snippet Details */}
            <div className="space-y-4">
              {/* Visibility */}
              <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border w-fit ${
                snippet.isPublic
                  ? isDark ? 'bg-green-900/30 text-green-400 border-green-600/30' : 'bg-green-100 text-green-800 border-green-200'
                  : isDark ? 'bg-gray-900/30 text-gray-400 border-gray-600/30' : 'bg-gray-100 text-gray-700 border-gray-200'
              } transition-colors duration-300`}>
                {snippet.isPublic ? (
                  <>
                    <Globe size={12} className="mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock size={12} className="mr-1" />
                    Private
                  </>
                )}
              </div>

              {/* Description */}
              {snippet.description && (
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
                  {snippet.description}
                </p>
              )}

              {/* Language */}
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLanguageColor(snippet.language)} transition-colors duration-300`}>
                  <Code2 size={12} className="inline mr-1" />
                  {snippet.language}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {snippet.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDark ? 'bg-orange-900/30 text-orange-400 border-orange-600/30' : 'bg-orange-100 text-orange-700 border-orange-200'
                    } transition-colors duration-300`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Code with Copy Button */}
              <div className="mt-4 relative">
                <button
                  onClick={handleCopy}
                  className={`absolute top-2 right-2 flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isDark
                      ? isCopied
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                      : isCopied
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check size={18} />
                    
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                     
                    </>
                  )}
                </button>
                <pre className={`p-4 rounded-lg overflow-x-auto ${
                  isDark ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-800'
                } transition-colors duration-300`}>
                  <code>{snippet.code}</code>
                </pre>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SnippetView;