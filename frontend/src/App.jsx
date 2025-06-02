import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './Theme/ThemeContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './components/Landing/Home.jsx';
import Features from './components/Landing/Features.jsx';
import Collection from './components/Landing/Collection.jsx';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import Dashboard from './components/User/Dashboard.jsx';
import SnippetList from './components/Snippet/SnippetList.jsx';
import SnippetForm from './components/Snippet/SnippetForm.jsx';
import SnippetView from './components/Snippet/SnippetView.jsx';
import Profile from './components/User/Profile.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="app">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/snippets/:id" element={<SnippetView />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
              />
              <Route
                path="/mysnippet"
                element={<ProtectedRoute><SnippetList /></ProtectedRoute>}
              />
              <Route 
                path="/mysnippet/edit/:id" 
                element={<ProtectedRoute><SnippetForm /></ProtectedRoute>} />
              <Route
                path="/mysnippet/new"
                element={<ProtectedRoute><SnippetForm /></ProtectedRoute>}
              />
              <Route 
              path="/mysnippet/:id" 
              element={<ProtectedRoute><SnippetView /></ProtectedRoute>} />
              <Route
                path="/profile"
                element={<ProtectedRoute><Profile /></ProtectedRoute>}
              />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;