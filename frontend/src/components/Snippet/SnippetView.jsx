import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { X, Code2, Tag, Globe, Lock, AlertCircle, Loader2, Copy, Check, Download } from 'lucide-react';
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
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    const fetchSnippet = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.get(`https://r2c-2z91.onrender.com/api/snippets/${id}`, {
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

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch {
      setCopySuccess('Failed to copy');
    }
  };

  const downloadCode = (snippet) => {
    const fileExtensions = {
      javascript: 'js',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      html: 'html',
      css: 'css',
      react: 'jsx',
      node: 'js',
    };
    
    const extension = fileExtensions[snippet.language.toLowerCase()] || 'txt';
    const fileName = `${snippet.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension}`;
    
    const element = document.createElement('a');
    const file = new Blob([snippet.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getLanguageColor = (language) => {
    const colors = {
      javascript: isDark
        ? 'bg-yellow-900/30 text-yellow-400 border-yellow-600/30'
        : 'bg-yellow-100 text-yellow-800 border-yellow-200',
      python: isDark
        ? 'bg-blue-900/30 text-blue-400 border-blue-600/30'
        : 'bg-blue-100 text-blue-800 border-blue-200',
      java: isDark
        ? 'bg-red-900/30 text-red-400 border-red-600/30'
        : 'bg-red-100 text-red-800 border-red-200',
      cpp: isDark
        ? 'bg-purple-900/30 text-purple-400 border-purple-600/30'
        : 'bg-purple-100 text-purple-800 border-purple-200',
      c: isDark
        ? 'bg-gray-900/30 text-gray-400 border-gray-600/30'
        : 'bg-gray-100 text-gray-800 border-gray-200',
      html: isDark
        ? 'bg-orange-900/30 text-orange-400 border-orange-600/30'
        : 'bg-orange-100 text-orange-800 border-orange-200',
      css: isDark
        ? 'bg-pink-900/30 text-pink-400 border-pink-600/30'
        : 'bg-pink-100 text-pink-800 border-pink-200',
      react: isDark
        ? 'bg-cyan-900/30 text-cyan-400 border-cyan-600/30'
        : 'bg-cyan-100 text-cyan-800 border-cyan-200',
      node: isDark
        ? 'bg-green-900/30 text-green-400 border-green-600/30'
        : 'bg-green-100 text-green-800 border-green-200',
      default: isDark
        ? 'bg-indigo-900/30 text-indigo-400 border-indigo-600/30'
        : 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return colors[language?.toLowerCase()] || colors.default;
  };

  // Enhanced syntax highlighter styles
  const getEnhancedSyntaxStyle = () => {
    if (isDark) {
      return {
        ...vscDarkPlus,
        'pre[class*="language-"]': {
          ...vscDarkPlus['pre[class*="language-"]'],
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '1px solid #334155',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        },
        'code[class*="language-"]': {
          ...vscDarkPlus['code[class*="language-"]'],
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
        }
      };
    } else {
      return {
        ...prism,
        'pre[class*="language-"]': {
          ...prism['pre[class*="language-"]'],
          background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
          border: '1px solid #cbd5e1',
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        }
      };
    }
  };

  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDark ? 'bg-gray-800/50' : 'bg-white';
  const cardBorder = isDark ? 'border-gray-700' : 'border-orange-100';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`relative ${cardBg} rounded-3xl p-6 sm:p-8 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border ${cardBorder} backdrop-blur-sm`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 z-10 ${
            isDark ? 'text-gray-300 hover:text-orange-400 hover:bg-gray-800' : 'text-gray-600 hover:text-orange-500 hover:bg-gray-100'
          }`}
        >
          <X size={20} />
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className={`animate-spin w-12 h-12 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.2" />
                  <path d="M21 12a9 9 0 01-9 9" />
                </svg>
              </div>
              <p className={`mt-4 text-lg ${textSecondary}`}>Loading snippet...</p>
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
          <div className="pr-10 clear-both">
            <div className="flex items-start justify-between mb-6">
              <h2 className={`text-3xl font-bold ${textPrimary} flex-1`}>{snippet.title}</h2>
              <div className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold border ${getLanguageColor(snippet.language)}`}>
                {snippet.language}
              </div>
            </div>

            {/* Visibility Status */}
            <div className="mb-6">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border w-fit ${
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
            </div>

            {/* Description */}
            {snippet.description && (
              <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-2xl p-6 mb-6`}>
                <h3 className={`text-lg font-semibold ${textPrimary} mb-3`}>Description</h3>
                <p className={`${textSecondary} leading-relaxed`}>{snippet.description}</p>
              </div>
            )}

            {/* Tags */}
            {snippet.tags.length > 0 && (
              <div className={`${isDark ? 'bg-orange-900/20' : 'bg-orange-50'} rounded-2xl p-6 mb-6`}>
                <h3 className={`text-lg font-semibold ${textPrimary} mb-3`}>Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {snippet.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isDark ? 'bg-orange-800/50 text-orange-300 border border-orange-700' : 'bg-orange-200 text-orange-800 border border-orange-300'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Code Section */}
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${textPrimary} flex items-center gap-2`}>
                  <Code2 className="w-5 h-5" />
                  Code Preview
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(snippet.code)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      copySuccess === 'Copied!' 
                        ? 'bg-green-500 text-white' 
                        : isDark 
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-600' 
                          : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-300'
                    }`}
                    aria-label={copySuccess === 'Copied!' ? 'Code copied' : 'Copy code'}
                  >
                    {copySuccess === 'Copied!' ? (
                      <>
                        <Check size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => downloadCode(snippet)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isDark 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-600'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-300'
                    }`}
                    aria-label="Download code"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>

              {/* Enhanced Syntax Highlighter */}
              <div className="relative group">
                <SyntaxHighlighter
                  language={snippet.language.toLowerCase()}
                  style={getEnhancedSyntaxStyle()}
                  customStyle={{
                    borderRadius: '16px',
                    padding: '24px',
                    margin: 0,
                    fontSize: '14px',
                    lineHeight: '1.6',
                    maxHeight: '600px',
                    overflow: 'auto',
                    position: 'relative',
                    ...(isDark ? {
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                      border: '1px solid #334155',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    } : {
                      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                    })
                  }}
                  showLineNumbers={true}
                  lineNumberStyle={{
                    minWidth: '3em',
                    paddingRight: '1em',
                    color: isDark ? '#64748b' : '#94a3b8',
                    fontSize: '12px',
                    userSelect: 'none'
                  }}
                  wrapLines={true}
                  wrapLongLines={true}
                >
                  {snippet.code}
                </SyntaxHighlighter>
                
                {/* Decorative gradient overlay */}
                <div className={`absolute inset-0 rounded-16px pointer-events-none ${
                  isDark 
                    ? 'bg-gradient-to-r from-slate-500/5 via-transparent to-blue-500/5'
                    : 'bg-gradient-to-r from-slate-100/20 via-transparent to-blue-100/20'
                }`} />
              </div>

              {/* Code metrics */}
              <div className={`mt-4 flex items-center gap-4 text-sm ${textSecondary}`}>
                <span className="flex items-center gap-1">
                  Lines: {snippet.code.split('\n').length}
                </span>
                <span className="flex items-center gap-1">
                  Characters: {snippet.code.length}
                </span>
                <span className="flex items-center gap-1">
                  Size: {(new Blob([snippet.code]).size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SnippetView;