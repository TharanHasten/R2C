import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Star, Heart, Zap, Shield, Users, ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../../Theme/ThemeContext.jsx';


function Home() {

 const { isDark } = useTheme();

  

  const bgClass = isDark 
    ? "min-h-screen transition-all duration-500 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"
    : "min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50";


  const textPrimary = isDark ? "text-white" : "text-gray-800";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-600";
  const cardBg = isDark ? "bg-gray-900" : "bg-white";

  return (
    <div className={bgClass}>
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-orange-900/10 via-amber-900/10 to-yellow-900/10' : 'bg-gradient-to-r from-orange-200/20 via-amber-200/20 to-yellow-200/20'}`}></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            
            <div className="absolute top-10 left-10 text-6xl text-orange-300 opacity-60 animate-bounce font-mono">{"{ }"}</div>
            <div className="absolute top-20 right-20 text-5xl text-amber-300 opacity-60 animate-pulse font-mono">{"< />"}</div>
            <div className="absolute bottom-10 left-1/4 text-4xl text-yellow-300 opacity-60 animate-bounce delay-300 font-mono">{"[ ]"}</div>
            <div className="absolute top-1/2 right-10 text-3xl text-orange-400 opacity-40 animate-pulse delay-500 font-mono">{"( )"}</div>
            
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mb-8 shadow-lg animate-pulse">
              <Code className="w-10 h-10 text-white" />
            </div>
            
            <h1 className={`text-6xl font-bold ${textPrimary} mb-6 leading-tight`}>
              Welcome to{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Ready to Code
              </span>
            </h1>
            
            <p className={`text-xl ${textSecondary} mb-8 max-w-2xl mx-auto leading-relaxed`}>
              Store, manage, and share your code snippets with incredible enthusiasm! The most exciting way to organize your code! 🔥
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="group bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className={`${cardBg} ${textPrimary} px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 ${isDark ? 'border-orange-700 hover:border-orange-500' : 'border-orange-200 hover:border-orange-300'}`}>
                <Link to="/features">Learn More</Link>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Why Section */}
      <section className={`py-20 ${isDark ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-sm`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className={`inline-flex items-center gap-2 ${isDark ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-700'} px-4 py-2 rounded-full text-sm font-medium mb-6`}>
            <Sparkles className="w-4 h-4" />
            Why Choose Us?
          </div>
          
          <h2 className={`text-4xl font-bold ${textPrimary} mb-6`}>
            Why Ready to Code?
          </h2>
          
          <p className={`text-lg ${textSecondary} leading-relaxed max-w-3xl mx-auto`}>
            Code Snippet Manager is your ultimate platform for organizing code snippets with unmatched enthusiasm! 
            Whether you're a developer, student, or coding enthusiast, our tool ignites your passion for clean, 
            organized code. Join thousands of energized developers who've supercharged their coding journey! 🚀✨
          </p>
        </div>
      </section>
        
         

      {/* CTA Section */}
      <section className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className={`${isDark ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-600' : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100'} rounded-3xl p-12 border relative overflow-hidden`}>
            <div className="absolute top-4 left-4 text-3xl text-orange-300 opacity-30 font-mono animate-pulse">{"=>"}</div>
            <div className="absolute bottom-4 right-4 text-2xl text-amber-300 opacity-30 font-mono animate-bounce">{"( )"}</div>
            
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mb-8">
              <Heart className="w-8 h-8 text-white" />
            </div>
            
            <h2 className={`text-4xl font-bold ${textPrimary} mb-6`}>
              Ready to energize your code?
            </h2>
            
            <p className={`text-lg ${textSecondary} mb-8 max-w-2xl mx-auto`}>
              Start your exciting journey with Code Snippet Manager today and experience the thrill of organized coding!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group bg-gradient-to-r from-orange-500 to-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Get Started
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Link>
              <button className={`${cardBg} ${textPrimary} px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 ${isDark ? 'border-orange-700 hover:border-orange-500' : 'border-orange-200 hover:border-orange-300'}`}>
                <Link to="/collection">Collection</Link>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-3 ${isDark ? 'bg-black border-gray-700' : 'bg-orange-50 border-orange-200'} border-t`}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full mb-4">
            <Code className="w-6 h-6 text-white" />
          </div>
          
          <p className={`${textSecondary} mb-4`}>
            Made with 🧡 for developers who love energetic, organized code
          </p>
          
          <div className={`flex justify-center gap-6 text-sm ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>
            {/* <a href="#" className={`${isDark ? 'hover:text-orange-200' : 'hover:text-orange-700'} transition-colors`}>Privacy</a>
            <a href="#" className={`${isDark ? 'hover:text-orange-200' : 'hover:text-orange-700'} transition-colors`}>Terms</a>
            <a href="#" className={`${isDark ? 'hover:text-orange-200' : 'hover:text-orange-700'} transition-colors`}>Support</a>
            <a href="#" className={`${isDark ? 'hover:text-orange-200' : 'hover:text-orange-700'} transition-colors`}>Blog</a> */}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;