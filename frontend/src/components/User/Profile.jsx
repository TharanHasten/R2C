import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  User2, Mail, Code2, Save, AlertCircle, CheckCircle, Loader2, Camera, Edit3, Globe, Star, Github, Twitter, Linkedin, MapPin
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useTheme } from '../../Theme/ThemeContext.jsx';

function Profile() {
  const { isDark } = useTheme();
  const { isAuthenticated,} = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    favoriteLanguage: '',
    bio: '',
    email: '',
    location: '',
    website: '',
    github: '',
    twitter: '',
    linkedin: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const backgroundClasses = `min-h-screen transition-all duration-500 ${
    isDark ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800' : 'bg-gradient-to-br from-gray-50 via-orange-50 to-amber-100'
  }`;
  const cardClasses = `p-6 rounded-2xl border ${
    isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white/70 border-gray-200'
  } backdrop-blur-sm`;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/user/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name, favoriteLanguage, bio, location, website, github, twitter, linkedin } = response.data.user.profile;
        setFormData({
          name: name || '',
          favoriteLanguage: favoriteLanguage || '',
          bio: bio || '',
          email: response.data.user.email || '',
          location: location || '',
          website: website || '',
          github: github || '',
          twitter: twitter || '',
          linkedin: linkedin || '',
        });
      } catch (err) {
        setErrors({ general: err.response?.data?.message || 'Failed to load profile data' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (formData.name.length > 50) newErrors.name = 'Name must be 50 characters or less';
    if (formData.bio.length > 500) newErrors.bio = 'Bio must be 500 characters or less';
    if (formData.location.length > 100) newErrors.location = 'Location must be 100 characters or less';
    if (formData.website && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+[/#?]?.*$/.test(formData.website)) {
      newErrors.website = 'Invalid website URL';
    }
    if (formData.github.length > 100) newErrors.github = 'GitHub handle too long';
    if (formData.twitter.length > 100) newErrors.twitter = 'Twitter handle too long';
    if (formData.linkedin.length > 100) newErrors.linkedin = 'LinkedIn handle too long';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/user/profile', { profile: formData }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Failed to save profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const languageOptions = [
    'JavaScript', 'Python', 'Java', 'TypeScript', 'Go', 'Rust',
    'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'Scala'
  ];

  if (isLoading) {
    return (
      <div className={`${backgroundClasses} flex items-center justify-center px-4 py-8 animate-fade-in-up`}>
        <div className="text-center">
          <Loader2 size={48} className={`animate-spin mb-4 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={backgroundClasses}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className={`mb-8 p-1 rounded-2xl ${isDark ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex space-x-1">
            {[
              { id: 'profile', label: 'Profile', icon: User2 },
              { id: 'social', label: 'Social Links', icon: Globe },
              { id: 'preferences', label: 'Preferences', icon: Star }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${activeTab === tab.id ? isDark ? 'bg-orange-500 text-white shadow-lg' : 'bg-orange-600 text-white shadow-lg' : isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'}`}
                aria-label={`Switch to ${tab.label} tab`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {errors.general && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center space-x-3 animate-pulse ${isDark ? 'bg-red-900/20 border-red-700 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
            <AlertCircle size={20} />
            <span className="font-medium">{errors.general}</span>
          </div>
        )}

        {success && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center space-x-3 animate-pulse ${isDark ? 'bg-green-900/20 border-green-700 text-green-400' : 'bg-green-50 border-green-200 text-green-700'}`}>
            <CheckCircle size={20} />
            <span className="font-medium">{success}</span>
          </div>
        )}

        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className={`${cardClasses} h-fit`}>
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center ${isDark ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gradient-to-r from-orange-600 to-amber-600'}`}>
                    <User2 size={48} className="text-white" />
                  </div>
                  <button className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`} aria-label="Change Profile Picture">
                    <Camera size={16} />
                  </button>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{formData.name || 'Your Name'}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{formData.email}</p>
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <Code2 size={16} className={isDark ? 'text-orange-400' : 'text-orange-600'} />
                  <span className={`text-sm font-medium ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{formData.favoriteLanguage || 'Select Language'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {activeTab === 'profile' && (
                <div className={`${cardClasses} space-y-6`}>
                  <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-orange-600 focus:border-orange-600'} ${errors.name ? 'border-red-500' : ''}`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-gray-200 cursor-not-allowed ${isDark ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-300 text-gray-600'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Favorite Language</label>
                      <select
                        value={formData.favoriteLanguage}
                        onChange={(e) => handleInputChange('favoriteLanguage', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${isDark ? 'bg-gray-800 border-gray-600 text-white focus:ring-orange-500 focus:border-orange-500' : 'bg-white border-gray-300 text-gray-900 focus:ring-orange-600 focus:border-orange-600'} ${errors.favoriteLanguage ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select a language</option>
                        {languageOptions.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="City, Country"
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-orange-600 focus:border-orange-600'} ${errors.location ? 'border-red-500' : ''}`}
                      />
                      {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-offset-2 resize-none ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-orange-600 focus:border-orange-600'} ${errors.bio ? 'border-red-500' : ''}`}
                    />
                    <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formData.bio.length}/500 characters</p>
                    {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                  </div>
                </div>
              )}
              {activeTab === 'social' && (
                <div className={`${cardClasses} space-y-6`}>
                  <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Social Links</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Globe, label: 'Website', field: 'website', placeholder: 'https://your-website.com' },
                      { icon: Github, label: 'GitHub', field: 'github', placeholder: 'github-username' },
                      { icon: Twitter, label: 'Twitter', field: 'twitter', placeholder: 'twitter-handle' },
                      { icon: Linkedin, label: 'LinkedIn', field: 'linkedin', placeholder: 'linkedin-profile' }
                    ].map((social) => (
                      <div key={social.label} className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <social.icon size={20} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                        </div>
                        <div className="flex-1">
                          <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{social.label}</label>
                          <input
                            type="text"
                            value={formData[social.field]}
                            onChange={(e) => handleInputChange(social.field, e.target.value)}
                            placeholder={social.placeholder}
                            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-orange-600 focus:border-orange-600'} ${errors[social.field] ? 'border-red-500' : ''}`}
                          />
                          {errors[social.field] && <p className="text-red-500 text-xs mt-1">{errors[social.field]}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'preferences' && (
                <div className={`${cardClasses} space-y-6`}>
                  <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Preferences</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Email Notifications</h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Receive updates about your snippets and activity</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className={`w-11 h-6 rounded-full peer peer-focus:outline-none peer-focus:ring-4 ${isDark ? 'bg-gray-700 peer-focus:ring-orange-800 peer-checked:bg-orange-600' : 'bg-gray-200 peer-focus:ring-orange-300 peer-checked:bg-orange-600'}`}></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Public Profile</h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Make your profile visible to other users</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className={`w-11 h-6 rounded-full peer peer-focus:outline-none peer-focus:ring-4 ${isDark ? 'bg-gray-700 peer-focus:ring-orange-800 peer-checked:bg-orange-600' : 'bg-gray-200 peer-focus:ring-orange-300 peer-checked:bg-orange-600'}`}></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600' : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700'}`}
                  aria-label="Save Profile Changes"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;