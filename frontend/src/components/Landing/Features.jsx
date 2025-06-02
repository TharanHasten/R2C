import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Tag, Share2, Search, User, Lock, Sparkles } from 'lucide-react';
import { useTheme } from '../../Theme/ThemeContext.jsx';


function Features() {
  const { isDark } = useTheme();

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Create and Edit Snippets",
      description: "Easily add and modify code snippets with support for multiple languages."
    },
    {
      icon: <Tag className="w-8 h-8" />,
      title: "Organize with Tags",
      description: "Categorize snippets using tags for quick retrieval."
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Public Sharing",
      description: "Share your snippets with the community by marking them as public."
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Search Snippets",
      description: "Find your own or public snippets using tag-based search."
    },
    {
      icon: <User className="w-8 h-8" />,
      title: "Profile Customization",
      description: "Personalize your profile with name, bio, and favorite language."
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Secure Authentication",
      description: "Safe login and signup with JWT-based security."
    }
  ];

  const bgClass = isDark 
    ? "min-h-screen transition-all duration-500 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"
    : "min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50";


  const textPrimary = isDark ? "text-white" : "text-gray-800";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-600";
  const cardBg = isDark ? "bg-gray-900" : "bg-white";
  const cardBorder = isDark ? "border-gray-700" : "border-orange-100";

  return (
    <div className={bgClass}>


      {/* Features Grid */}
      <section className={`py-20 ${isDark ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-sm`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 ${isDark ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-700'} px-4 py-2 rounded-full text-sm font-medium mb-6`}>
              <Sparkles className="w-4 h-4" />
              Key Features
            </div>
            <h2 className={`text-4xl font-bold ${textPrimary} mb-4`}>
              Why You'll Love Our Features
            </h2>
            <p className={`text-lg ${textSecondary}`}>
              Everything you need to supercharge your coding workflow with enthusiasm
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group ${cardBg} rounded-3xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border ${cardBorder} hover:border-orange-300`}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${isDark ? 'bg-gradient-to-r from-orange-900/50 to-amber-900/50' : 'bg-gradient-to-r from-orange-100 to-amber-100'} rounded-2xl mb-6 group-hover:scale-110 transition-transform`}>
                  <div className={isDark ? 'text-orange-400' : 'text-orange-600'}>
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className={`text-xl font-bold ${textPrimary} mb-3`}>
                  {feature.title}
                </h3>
                
                <p className={`${textSecondary} leading-relaxed`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className={`${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100'} rounded-3xl p-12 border relative overflow-hidden`}>
            <div className="absolute top-4 left-4 text-3xl text-orange-300 opacity-30 font-mono animate-pulse">{"=>"}</div>
            <div className="absolute bottom-4 right-4 text-2xl text-amber-300 opacity-30 font-mono animate-bounce">{"( )"}</div>
            
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mb-8">
              <Code className="w-8 h-8 text-white" />
            </div>
            
            <h2 className={`text-4xl font-bold ${textPrimary} mb-6`}>
              Ready to Transform Your Coding?
            </h2>
            
            <p className={`text-lg ${textSecondary} mb-8 max-w-2xl mx-auto`}>
              Dive into Code Snippet Manager and experience the thrill of organized, secure, and shareable coding!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Now
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Link>
              <Link
                to="/collection"
                className={`${isDark ? 'text-orange-400 hover:bg-orange-900/20' : 'text-orange-600 hover:bg-orange-50'} px-8 py-4 rounded-full font-semibold text-lg transition-colors`}
              >
                View Snippets
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features;