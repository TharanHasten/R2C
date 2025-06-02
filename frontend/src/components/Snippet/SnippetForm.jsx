import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Code2, 
  Save, 
  Edit3, 
  Plus, 
  Tag, 
  FileText, 
  Globe, 
  Lock, 
  AlertCircle, 
  ArrowLeft, 
  Loader2 
} from 'lucide-react';
import { useTheme } from '../../Theme/ThemeContext.jsx';

function SnippetForm() {
  const { isDark } = useTheme();
  const { id } = useParams(); // Snippet ID for edit, undefined for create
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    language: 'JavaScript',
    tags: '',
    description: '',
    isPublic: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);

  const languages = [
    'JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'C#', 'PHP', 
    'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'HTML', 'CSS', 'SQL'
  ];

  useEffect(() => {
    if (id) {
      const fetchSnippet = async () => {
        setIsFetching(true);
        setError('');
        try {
          const response = await axios.get(`/api/snippets/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setFormData({
            title: response.data.title,
            code: response.data.code,
            language: response.data.language,
            tags: response.data.tags.join(', '),
            description: response.data.description || '',
            isPublic: response.data.isPublic,
          });
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load snippet');
        } finally {
          setIsFetching(false);
        }
      };
      fetchSnippet();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const data = {
      title: formData.title.trim(),
      code: formData.code.trim(),
      language: formData.language,
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0),
      description: formData.description.trim(),
      isPublic: formData.isPublic,
    };

    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      if (id) {
        await axios.put(`/api/snippets/${id}`, data, config);
      } else {
        await axios.post('/api/snippets', data, config);
      }
      navigate('/mysnippet', { state: { fromEdit: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save snippet');
    } finally {
      setIsLoading(false);
    }
  };

  const getLanguageColor = (lang) => {
    const colors = {
      javascript: isDark ? 'bg-yellow-900/30 text-yellow-400 border-yellow-600/30' : 'bg-yellow-100 text-yellow-800 border-yellow-200',
      python: isDark ? 'bg-blue-900/30 text-blue-400 border-blue-600/30' : 'bg-blue-100 text-blue-800 border-blue-200',
      java: isDark ? 'bg-red-900/30 text-red-400 border-red-600/30' : 'bg-red-100 text-red-800 border-red-200',
      typescript: isDark ? 'bg-blue-900/30 text-blue-400 border-blue-600/30' : 'bg-blue-100 text-blue-800 border-blue-200',
      default: isDark ? 'bg-gray-900/30 text-gray-400 border-gray-600/30' : 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[lang?.toLowerCase()] || colors.default;
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-500 animate-fade-in-up ${
      isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700' : 'bg-gradient-to-br from-gray-50 via-orange-50 to-amber-100'
    }`}>
      <div className={`w-full max-w-2xl p-8 rounded-2xl shadow-2xl transition-all duration-500 animate-slide-in-up ${
        isDark ? 'bg-gray-900 border border-gray-700' : 'bg-white/90 border border-gray-200'
      } backdrop-blur-lg`}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/mysnippet')}
          className={`flex items-center space-x-2 mb-6 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
            isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          <ArrowLeft size={18} />
          <span>Back to My Snippets</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8 animate-pulse-short">
          <div className={`inline-flex p-3 rounded-xl mb-4 ${
            id ? isDark ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-blue-600 to-cyan-600'
               : isDark ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gradient-to-r from-orange-600 to-amber-600'
          } transition-transform duration-300 hover:scale-110`}>
            {id ? <Edit3 size={32} className="text-white" /> : <Plus size={32} className="text-white" />}
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-300`}>
            {id ? 'Edit Snippet' : 'Create New Snippet'}
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>
            {id ? 'Update your code masterpiece' : 'Craft your next code masterpiece'}
          </p>
        </div>

        {isFetching ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 size={48} className={`animate-spin mb-4 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}>Loading snippet...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Error Message */}
            {error && (
              <div className={`p-4 rounded-lg mb-6 flex items-center space-x-2 animate-fade-in ${
                isDark ? 'bg-red-900/20 border border-red-700 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                  <FileText size={16} className="inline mr-2" />Title *
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                    <FileText size={18} />
                  </div>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Give your snippet a catchy title..."
                    required
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                      isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500'
                    }`}
                  />
                </div>
              </div>

              {/* Language & Visibility Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {/* Language */}
                <div className="md:col-span-2 space-y-2">
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                    <Code2 size={16} className="inline mr-2" />Programming Language *
                  </label>
                  <div className="relative">
                    <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                      <Code2 size={18} />
                    </div>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                        isDark ? 'bg-gray-800 border-gray-600 text-white focus:border-orange-500' : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                      }`}
                    >
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getLanguageColor(formData.language)} transition-colors duration-300`}>
                      <Code2 size={12} className="mr-1" />{formData.language}
                    </span>
                  </div>
                </div>

                {/* Visibility Toggle */}
                <div className="space-y-2">
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>Visibility</label>
                  <div className={`p-3 rounded-lg border transition-all duration-300 ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`relative w-11 h-6 transition-colors duration-300 rounded-full ${formData.isPublic ? 'bg-gradient-to-r from-green-500 to-emerald-500' : isDark ? 'bg-gray-600' : 'bg-gray-400'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 transform ${formData.isPublic ? 'translate-x-5' : 'translate-x-0'} flex items-center justify-center`}>
                          {formData.isPublic ? <Globe size={12} className="text-green-600" /> : <Lock size={12} className="text-gray-600" />}
                        </div>
                      </div>
                      <span className={`ml-3 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>{formData.isPublic ? 'Public' : 'Private'}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                  <Tag size={16} className="inline mr-2" />Tags (comma-separated)
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                    <Tag size={18} />
                  </div>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g., algorithm, sorting, array, utility"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                      isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500'
                    }`}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                  <FileText size={16} className="inline mr-2" />Description
                </label>
                <div className="relative">
                  <div className={`absolute top-3 left-0 pl-3 flex items-start pointer-events-none ${isDark ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-300`}>
                    <FileText size={18} />
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what your snippet does and how to use it..."
                    rows={3}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 resize-none ${
                      isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500'
                    }`}
                  />
                </div>
              </div>

              {/* Code Editor */}
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} transition-colors duration-300`}>
                  <Code2 size={16} className="inline mr-2" />Code *
                </label>
                <div className={`rounded-lg border overflow-hidden ${isDark ? 'border-gray-600' : 'border-gray-300'} transition-all duration-300`}>
                  <textarea
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="// Paste your amazing code here...\nfunction helloWorld() {\n    console.log('Hello, World!');\n}"
                    required
                    rows={12}
                    className={`w-full px-4 py-3 font-mono text-sm resize-none focus:outline-none transition-all duration-300 ${
                      isDark ? 'bg-gray-900 text-gray-100 placeholder-gray-500' : 'bg-gray-900 text-gray-100 placeholder-gray-400'
                    }`}
                    style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <button
                  type="button"
                  onClick={() => navigate('/mysnippet')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                    isDark ? 'text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-300'
                  }`}
                >Cancel</button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.title.trim() || !formData.code.trim()}
                  className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50 animate-pulse-short ${
                    id
                      ? isDark ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25' : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-600/25'
                      : isDark ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25' : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 shadow-lg shadow-orange-600/25'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 size={18} className="animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save size={18} />
                      <span>{id ? 'Update Snippet' : 'Create Snippet'}</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default SnippetForm;