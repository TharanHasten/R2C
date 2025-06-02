import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Code2, Search, Plus, Edit3, Trash2, Eye, Tag, Calendar, Globe, Lock, AlertCircle, FileText, Loader2, X
} from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useTheme } from '../../Theme/ThemeContext.jsx';

function SnippetList() {
  const { isDark } = useTheme();
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [snippets, setSnippets] = useState([]);
  const [filteredSnippets, setFilteredSnippets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchSnippets();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (location.state?.fromEdit) {
      fetchSnippets();
    }
  }, [location]);

  const fetchSnippets = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/snippets/my-snippets', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSnippets(response.data);
      setFilteredSnippets(response.data);
      setSearchMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load snippets');
      setSnippets([]);
      setFilteredSnippets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredSnippets(snippets);
      setSearchMode(false);
      setError('');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/snippets/search', {
        params: { tags: searchQuery.trim() },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFilteredSnippets(response.data);
      setSearchMode(true);
      setError(response.data.length === 0 ? `Code for the tag "${searchQuery}" not found` : '');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search snippets');
      setFilteredSnippets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchIconClick = () => {
    handleSearch();
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone! 🗑️`)) return;
    try {
      await axios.delete(`/api/snippets/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const updatedSnippets = snippets.filter((snippet) => snippet._id !== id);
      setSnippets(updatedSnippets);
      setFilteredSnippets(searchMode ? filteredSnippets.filter((snippet) => snippet._id !== id) : updatedSnippets);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete snippet');
    }
  };

  const resetSearch = () => {
    setSearchQuery('');
    setFilteredSnippets(snippets);
    setSearchMode(false);
    setError('');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-500 animate-fade-in-up ${
      isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700' : 'bg-gradient-to-br from-gray-50 via-orange-50 to-amber-100'
    }`}>
      <div className={`w-full max-w-7xl p-8 rounded-2xl shadow-2xl transition-all duration-500 animate-slide-in-up ${
        isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white/90 border border-gray-200'
      } backdrop-blur-lg relative`}>
        {/* Header */}
        <div className="text-center mb-8 animate-pulse-short">
          <div className={`inline-flex p-3 rounded-xl mb-4 ${isDark ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gradient-to-r from-orange-600 to-amber-600'} transition-transform duration-300 hover:scale-110`}>
            <Code2 size={32} className="text-white" />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>My Code Snippets</h2>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>Manage your personal collection of code treasures</p>
        </div>

        {/* Search & Actions Bar */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search by tag..."
                    className={`w-full pl-10 pr-10 py-2 rounded-lg border transition-all duration-300 ${
                      isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500'
                    }`}
                  />
                  <button
                    onClick={handleSearchIconClick}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${isDark ? 'text-gray-400 hover:text-orange-400' : 'text-gray-500 hover:text-orange-500'} transition-colors duration-300`}
                  >
                    <Search size={18} />
                  </button>
                </div>
                {searchMode && (
                  <button
                    onClick={resetSearch}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${isDark ? 'text-gray-300 hover:text-white bg-gray-800 border border-gray-600' : 'text-gray-600 hover:text-gray-900 bg-gray-100 border border-gray-300'}`}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            <Link to="/mysnippet/new" className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 ${isDark ? 'bg-orange-500 hover:bg-orange-600' : 'bg-orange-600 hover:bg-orange-700'}`}>
              <div className="flex items-center space-x-1"><Plus size={16} /><span>Create</span></div>
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`p-4 rounded-lg mb-6 flex items-center space-x-2 animate-fade-in ${isDark ? 'bg-red-900/20 border border-red-700 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            <AlertCircle size={18} /><span className="text-sm">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 size={48} className={`animate-spin mb-4 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>Loading your awesome snippets...</p>
            </div>
          </div>
        )}

        {/* Snippets Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSnippets.length > 0 ? (
              filteredSnippets.map((snippet) => (
                <div key={snippet._id} className={`group relative rounded-2xl shadow-xl transition-all duration-500 transform hover:scale-105 animate-fade-in-up ${isDark ? 'bg-gray-900 border border-gray-700 hover:border-orange-500/50' : 'bg-white/90 border border-gray-200 hover:border-orange-400/50'} backdrop-blur-lg`}>
                  <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className={`text-lg font-bold line-clamp-2 pr-2 ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>{snippet.title}</h3>
                      <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border ${snippet.isPublic ? isDark ? 'bg-green-900/30 text-green-400 border-green-600/30' : 'bg-green-100 text-green-800 border-green-200' : isDark ? 'bg-gray-900/30 text-gray-400 border-gray-600/30' : 'bg-gray-100 text-gray-700 border-gray-200'} transition-colors duration-300`}>
                        {snippet.isPublic ? (<><Globe size={12} className="mr-1" />Public</>) : (<><Lock size={12} className="mr-1" />Private</>)}
                      </div>
                    </div>
                    <p className={`text-sm line-clamp-2 mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>{snippet.description || 'No description'}</p>
                    <div className="flex items-center mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getLanguageColor(snippet.language)} transition-colors duration-300`}><Code2 size={12} className="inline mr-1" />{snippet.language}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {snippet.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-orange-900/30 text-orange-400 border-orange-600/30' : 'bg-orange-100 text-orange-700 border-orange-200'} transition-colors duration-300`}>#{tag}</span>
                      ))}
                      {snippet.tags.length > 3 && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-gray-900/30 text-gray-400 border-gray-600/30' : 'bg-gray-100 text-gray-600 border-gray-200'} transition-colors duration-300`}>+{snippet.tags.length - 3}</span>
                      )}
                    </div>
                    <div className={`flex items-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}><Calendar size={12} className="mr-2" />{formatDate(snippet.createdAt)}</div>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-2">
                      <Link to={`/mysnippet/${snippet._id}`} state={{ fromList: true }} 
                      className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg font-semibold text-white transition-all duration-300 ${isDark ? 'bg-gray-500 hover:bg-gray-700' : 'bg-gray-400 hover:bg-gray-700'}`}><Eye size={14} /><span>View</span></Link>
                      <Link to={`/mysnippet/edit/${snippet._id}`} className={`flex-1 flex items-center justify-center space-x-1 py-2 px-3 rounded-lg font-semibold text-white transition-all duration-300 ${isDark ? 'bg-orange-500 hover:bg-orange-600' : 'bg-orange-600 hover:bg-orange-700'}`}><Edit3 size={14} /><span>Edit</span></Link>
                      <button onClick={() => handleDelete(snippet._id, snippet.title)} className={`p-2 rounded-lg font-semibold text-white transition-all duration-300 ${isDark ? 'bg-red-500 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'}`}><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              !error && !searchMode && (
                <div className="text-center py-20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${isDark ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gradient-to-r from-orange-600 to-amber-600'} transition-transform duration-300 hover:scale-110`}><FileText size={32} className="text-white" /></div>
                  <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>No snippets yet!</h3>
                  <p className={`text-sm mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>Create your first awesome code snippet to get started!</p>
                  <Link to="/mysnippet/new" className={`px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 ${isDark ? 'bg-orange-500 hover:bg-orange-600' : 'bg-orange-600 hover:bg-orange-700'}`}><div className="flex items-center space-x-1"><Plus size={16} /><span>Create</span></div></Link>
                </div>
              )
            )}
          </div>
        )}

        {/* Floating Action Button */}
        <Link to="/mysnippet/new" className={`fixed bottom-8 right-8 w-12 h-12 rounded-full transition-all duration-300 ${isDark ? 'bg-orange-500 hover:bg-orange-600' : 'bg-orange-600 hover:bg-orange-700'} flex items-center justify-center`} title="Create new snippet">
          <Plus size={20} className="text-white" />
        </Link>
      </div>
    </div>
  );
}

export default SnippetList;