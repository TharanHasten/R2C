import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Search, Code, ArrowRight, X, Copy, Check } from 'lucide-react';
import axios from 'axios';
import { useTheme } from '../../Theme/ThemeContext.jsx';

function Collection() {
  const { isDark } = useTheme();
  const [tags, setTags] = useState('');
  const [snippets, setSnippets] = useState([]);
  const [error, setError] = useState('');
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all public snippets on mount
  useEffect(() => {
    const fetchAllSnippets = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/snippets');
        setSnippets(response.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load snippets');
        setSnippets([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllSnippets();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const cleanedTags = tags
      .trim()
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag)
      .join(',');
    if (!cleanedTags) {
      setError('Please enter valid tags');
      setSnippets([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/snippets/search2?tags=${encodeURIComponent(cleanedTags)}`);
      setSnippets(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search snippets');
      setSnippets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchIconClick = () => {
    const form = document.querySelector('form');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  };

  const openModal = (snippet) => {
    setSelectedSnippet(snippet);
    setCopySuccess('');
  };

  const closeModal = () => {
    setSelectedSnippet(null);
    setCopySuccess('');
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
    return colors[language.toLowerCase()] || colors.default;
  };

  const bgClass = isDark
    ? 'min-h-screen transition-all duration-500 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800'
    : 'min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50';
  const textPrimary = isDark ? 'text-white' : 'text-gray-800';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDark ? 'bg-gray-800/50' : 'bg-white';
  const cardBorder = isDark ? 'border-gray-700' : 'border-orange-100';
  const syntaxTheme = isDark ? vscDarkPlus : prism;

  return (
    <div className={bgClass}>
      {/* Header */}
      <header className="py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className={`text-5xl font-bold ${textPrimary} mb-8 leading-tight`}>
            Explore the{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
              Public Snippet Collection
            </span>
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex justify-center">
            <div className={`relative w-full ${cardBg} rounded-full border ${cardBorder} shadow-lg backdrop-blur-sm`}>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags (comma-separated)"
                className={`w-full px-6 py-4 ${textPrimary} bg-transparent rounded-full focus:outline-none placeholder:${textSecondary}`}
                aria-label="Search snippets by tags"
              />
              <button
                type="button"
                onClick={handleSearchIconClick}
                aria-label="Search snippets"
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
                  isDark ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'
                } transition-colors`}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {error && (
            <p
              className={`text-red-500 mt-4 font-medium ${isDark ? 'bg-red-900/20' : 'bg-red-100'} px-4 py-2 rounded-full inline-block`}
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
      </header>

      {/* Snippets Section */}
      <section className={`py-16 ${isDark ? 'bg-gray-800/30' : 'bg-white/50'} backdrop-blur-sm`}>
        <div className="max-w-6xl mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <div className={`animate-spin w-12 h-12 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.2" />
                    <path d="M21 12a9 9 0 01-9 9" />
                  </svg>
                </div>
                <p className={`mt-4 text-lg ${textSecondary}`}>Loading snippets...</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {snippets.length === 0 && !error ? (
                <p className={`text-center col-span-full ${textSecondary} text-lg`} role="status">
                  No snippets found. Try searching with different tags!
                </p>
              ) : (
                snippets.map((snippet) => (
                  <div
                    key={snippet._id}
                    className={`group ${cardBg} rounded-3xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border ${cardBorder} ${
                      isDark ? 'hover:border-gray-600 hover:bg-gray-800' : 'hover:border-orange-300'
                    } relative backdrop-blur-sm`}
                  >
                    <div
                      className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border ${getLanguageColor(
                        snippet.language
                      )}`}
                    >
                      {snippet.language}
                    </div>

                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mb-6">
                      <Code className="w-6 h-6 text-white" />
                    </div>

                    <h3 className={`text-xl font-bold ${textPrimary} mb-3 pr-16`}>{snippet.title}</h3>

                    <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-2xl p-4 mb-4`}>
                      <p className={`${textSecondary} text-sm line-clamp-3`}>{snippet.description || 'No description'}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {snippet.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isDark ? 'bg-orange-900/30 text-orange-300 border border-orange-700/50' : 'bg-orange-100 text-orange-700 border border-orange-200'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => openModal(snippet)}
                      className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center transition-all duration-200 ${
                        isDark
                          ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700'
                          : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700'
                      }`}
                      aria-label={`View details for ${snippet.title}`}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Modal for Snippet Details */}
      {selectedSnippet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className={`relative ${cardBg} rounded-3xl p-6 sm:p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border ${cardBorder} backdrop-blur-sm`}>
        <button
          onClick={closeModal}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
            isDark ? 'text-gray-300 hover:text-orange-400 hover:bg-gray-800' : 'text-gray-600 hover:text-orange-500 hover:bg-gray-100'
          }`}
        >
          <X size={20} />
        </button>

            <div className="pr-10 clear-both">
              <div className="flex items-start justify-between mb-6">
                <h2 className={`text-3xl font-bold ${textPrimary} flex-1`}>{selectedSnippet.title}</h2>
                <div className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold border ${getLanguageColor(selectedSnippet.language)}`}>
                  {selectedSnippet.language}
                </div>
              </div>

              <div className={`${isDark ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-2xl p-6 mb-6`}>
                <h3 className={`text-lg font-semibold ${textPrimary} mb-3`}>Description</h3>
                <p className={`${textSecondary} leading-relaxed`}>{selectedSnippet.description || 'No description'}</p>
              </div>

              <div className={`${isDark ? 'bg-orange-900/20' : 'bg-orange-50'} rounded-2xl p-6 mb-6`}>
                <h3 className={`text-lg font-semibold ${textPrimary} mb-3`}>Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSnippet.tags.map((tag, index) => (
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

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-lg font-semibold ${textPrimary}`}>Code</h3>
                  <button
                    onClick={() => copyToClipboard(selectedSnippet.code)}
                    className={`p-2 rounded-lg transition-colors ${
                      copySuccess === 'Copied!' ? 'bg-green-500 text-white' : isDark ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                    aria-label={copySuccess === 'Copied!' ? 'Code copied' : 'Copy code'}
                  >
                    {copySuccess === 'Copied!' ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>

                <div className="relative">
                  <SyntaxHighlighter
                    language={selectedSnippet.language.toLowerCase()}
                    style={syntaxTheme}
                    customStyle={{
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      background: isDark ? '#1e1e1e' : '#f8f9fa',
                      border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      maxHeight: '500px',
                      overflow: 'auto',
                    }}
                    showLineNumbers
                  >
                    {selectedSnippet.code}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Collection;