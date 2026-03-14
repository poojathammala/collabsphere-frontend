import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Explore from './pages/Explore';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import Collaborations from './pages/Collaborations';
import CollabBotAI from './pages/CollabBotAI';
import CollabBotBubble from './components/CollabBotBubble';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column', gap: 16
      }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid #22222e',
          borderTopColor: '#7c6af7',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite'
        }} />
        <p style={{ color: '#8888aa', fontSize: 14 }}>Loading CollabSphere...</p>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/feed" replace />;
};

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <CollabBotBubble />
  </>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/feed" replace />} />

      {/* Public */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Protected */}
      <Route path="/feed" element={
        <ProtectedRoute><Layout><Feed /></Layout></ProtectedRoute>
      } />
      <Route path="/explore" element={
        <ProtectedRoute><Layout><Explore /></Layout></ProtectedRoute>
      } />
      <Route path="/create" element={
        <ProtectedRoute><Layout><CreatePost /></Layout></ProtectedRoute>
      } />
      <Route path="/posts/:id" element={
        <ProtectedRoute><Layout><PostDetail /></Layout></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>
      } />
      <Route path="/users/:id" element={
        <ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>
      } />
      <Route path="/collaborations" element={
        <ProtectedRoute><Layout><Collaborations /></Layout></ProtectedRoute>
      } />
      <Route path="/collabbot" element={
        <ProtectedRoute><Layout><CollabBotAI /></Layout></ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/feed" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#16161f',
              color: '#e8e8f0',
              border: '1px solid #22222e',
              borderRadius: '10px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#34d399', secondary: '#16161f' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#16161f' } },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
