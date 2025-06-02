import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  User2, FileText, Plus, Edit3, AlertCircle, Loader2, Tag, Globe, Lock, Eye, Heart, PieChart, Code2
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useTheme } from '../../Theme/ThemeContext.jsx';

function Dashboard() {
  const { isDark } = useTheme();
  const { isAuthenticated, } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({ user: null, snippets: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const backgroundClasses = `min-h-screen transition-all duration-500 ${
    isDark ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800' : 'bg-gradient-to-br from-gray-50 via-orange-50 to-amber-100'
  }`;
  const cardClasses = `p-6 rounded-2xl border ${
    isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-gray-200'
  } backdrop-blur-sm`;
  const hoverCardClasses = `p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
    isDark ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' : 'bg-white/70 border-gray-200 hover:bg-white'
  } backdrop-blur-sm`;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [userResponse, snippetsResponse] = await Promise.all([
          axios.get('https://r2c-2z91.onrender.com/api/user/dashboard', config),
          axios.get('https://r2c-2z91.onrender.com/api/snippets/my-snippets', config),
        ]);
        setDashboardData({ user: userResponse.data.user, snippets: snippetsResponse.data });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, navigate]);

  const getLanguageColor = (language) => {
    const colors = {
      javascript: isDark ? 'bg-yellow-900/30 text-yellow-400 border-yellow-600/30' : 'bg-yellow-100 text-yellow-800 border-yellow-200',
      python: isDark ? 'bg-blue-900/30 text-blue-400 border-blue-600/30' : 'bg-blue-100 text-blue-800 border-blue-200',
      java: isDark ? 'bg-red-900/30 text-red-400 border-red-600/30' : 'bg-red-100 text-red-800 border-red-200',
      css: isDark ? 'bg-green-900/30 text-green-400 border-green-600/30' : 'bg-green-100 text-green-800 border-green-200',
      html: isDark ? 'bg-orange-900/30 text-orange-400 border-orange-600/30' : 'bg-orange-100 text-orange-800 border-orange-200',
      default: isDark ? 'bg-gray-900/30 text-gray-400 border-gray-600/30' : 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[language?.toLowerCase()] || colors.default;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const { user: dashboardUser, snippets } = dashboardData;
  const totalSnippets = snippets.length;
  const publicSnippets = snippets.filter((s) => s.isPublic).length;
  const totalViews = snippets.reduce((sum, s) => sum + (s.views || 0), 0);
  const totalLikes = snippets.reduce((sum, s) => sum + (s.likes || 0), 0);
  const languageCounts = snippets.reduce((acc, s) => {
    acc[s.language] = (acc[s.language] || 0) + 1;
    return acc;
  }, {});
  const languageChartData = {
    labels: Object.keys(languageCounts).map((lang) => lang.charAt(0).toUpperCase() + lang.slice(1)),
    datasets: [{
      data: Object.values(languageCounts),
      backgroundColor: ['#FBBF24', '#3B82F6', '#EF4444', '#10B981', '#F97316'],
      borderColor: isDark ? '#1F2937' : '#F3F4F6',
      borderWidth: 2,
    }],
  };

  const recentActivity = snippets.slice(0, 4).map((snippet, index) => ({
    action: index % 2 === 0 ? 'Created' : 'Updated',
    item: snippet.title,
    time: `${index + 1} day${index > 0 ? 's' : ''} ago`,
    type: index % 2 === 0 ? 'create' : 'update',
  }));

  if (isLoading) {
    return (
      <div className={`${backgroundClasses} flex items-center justify-center px-4 py-8 animate-fade-in-up`}>
        <div className="text-center">
          <Loader2 size={48} className={`animate-spin mb-4 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={backgroundClasses}>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {error && (
          <div className={`p-4 rounded-lg flex items-center space-x-2 animate-fade-in ${isDark ? 'bg-red-900/20 border border-red-700 text-red-400' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            <AlertCircle size={18} /><span className="text-sm">{error}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Snippets', value: totalSnippets, icon: FileText, color: 'blue' },
            { label: 'Total Views', value: totalViews.toLocaleString(), icon: Eye, color: 'green' },
            { label: 'Total Likes', value: totalLikes, icon: Heart, color: 'red' },
            { label: 'Public Snippets', value: publicSnippets, icon: Globe, color: 'purple' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`${hoverCardClasses} animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${isDark ? `bg-${stat.color}-900/30` : `bg-${stat.color}-100`}`}>
                  <stat.icon size={24} className={isDark ? `text-${stat.color}-400` : `text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className={`${cardClasses} animate-fade-in-up`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/mysnippet/new"
                  className={`flex items-center space-x-3 p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${isDark ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-transparent' : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white border-transparent'}`}
                  aria-label="Create New Snippet"
                >
                  <Plus size={20} /><span className="font-medium">Create New Snippet</span>
                </Link>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-3 p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600' : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'}`}
                  aria-label="Edit Profile"
                >
                  <Edit3 size={20} /><span className="font-medium">Edit Profile</span>
                </Link>
              </div>
            </div>
            <div className={`${cardClasses} animate-fade-in-up`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Recent Snippets
                </h3>
                <Link
                  to="/mysnippet"
                  className={`text-sm font-medium ${
                    isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  } transition-colors`}
                  aria-label="View All Snippets"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {snippets.slice(0, 4).map((snippet) => (
                  <div
                    key={snippet._id}
                    className={`p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                      isDark 
                        ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' 
                        : 'bg-gray-50 border-gray-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {snippet.title}
                        </h4>
                        <p className={`text-sm mt-1 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {snippet.description || 'No description'}
                        </p>
                      </div>
                      <div className={`ml-4 px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${
                        snippet.isPublic 
                          ? isDark ? 'bg-green-900/30 text-green-400 border-green-600/30' : 'bg-green-100 text-green-800 border-green-200'
                          : isDark ? 'bg-gray-900/30 text-gray-400 border-gray-600/30' : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {snippet.isPublic ? <Globe size={10} /> : <Lock size={10} />}
                        <span>{snippet.isPublic ? 'Public' : 'Private'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLanguageColor(snippet.language)}`}>
                          {snippet.language}
                        </span>
                        <div className="flex items-center space-x-3 text-xs">
                          <span className={`flex items-center space-x-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Eye size={12} />
                            <span>{snippet.views || 0}</span>
                          </span>
                          <span className={`flex items-center space-x-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Heart size={12} />
                            <span>{snippet.likes || 0}</span>
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {formatDate(snippet.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
                {snippets.length === 0 && (
                  <div className="text-center py-6">
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>No snippets yet! Create one to get started.</p>
                    <Link
                      to="/mysnippet/new"
                      className={`mt-2 inline-flex items-center space-x-1 px-4 py-2 rounded-lg font-semibold text-white ${isDark ? 'bg-orange-500 hover:bg-orange-600' : 'bg-orange-600 hover:bg-orange-700'}`}
                      aria-label="Create New Snippet"
                    >
                      <Plus size={16} /><span>Create Snippet</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className={`${cardClasses} animate-fade-in-up`}>
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isDark ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gradient-to-r from-orange-600 to-amber-600'}`}>
                  <User2 size={24} className="text-white" />
                </div>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{dashboardUser?.profile?.name || dashboardUser?.username}</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{dashboardUser?.email}</p>
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <Code2 size={16} className={isDark ? 'text-orange-400' : 'text-orange-600'} />
                  <span className={`text-sm font-medium ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{dashboardUser?.profile?.favoriteLanguage || 'Not set'}</span>
                </div>
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{dashboardUser?.profile?.bio || 'No bio provided'}</p>
                <Link
                  to="/profile"
                  className={`mt-4 inline-flex items-center space-x-1 px-4 py-2 rounded-lg font-semibold text-white ${isDark ? 'bg-orange-500 hover:bg-orange-600' : 'bg-orange-600 hover:bg-orange-700'}`}
                  aria-label="Edit Profile"
                >
                  <Edit3 size={16} /><span>Edit Profile</span>
                </Link>
              </div>
            </div>
            <div className={`${cardClasses} animate-fade-in-up`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-1.5 rounded-full ${activity.type === 'create' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      {activity.type === 'create' ? <Plus size={12} /> : <Edit3 size={12} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}><span className="font-medium">{activity.action}</span> {activity.item}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{activity.time}</p>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No recent activity</p>}
              </div>
            </div>
            <div className={`${cardClasses} animate-fade-in-up`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Language Usage</h3>
              {Object.keys(languageCounts).length > 0 ? (
                <div data-chart="pie" data-chart-options={JSON.stringify({
                  type: 'pie',
                  data: languageChartData,
                  options: {
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: isDark ? '#D1D5DB' : '#374151',
                          font: { size: 12 }
                        }
                      },
                      tooltip: {
                        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                        titleColor: isDark ? '#FFFFFF' : '#111827',
                        bodyColor: isDark ? '#D1D5DB' : '#374151'
                      }
                    }
                  }
                })} />
              ) : (
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No language data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;