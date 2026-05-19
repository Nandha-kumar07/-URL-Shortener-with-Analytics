import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import { Toaster } from 'react-hot-toast';
import { Code, Briefcase } from 'lucide-react';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics/:shortId" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer style={{ textAlign: 'center', padding: '2.5rem', marginTop: 'auto', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', backdropFilter: 'blur(12px)', background: 'rgba(11, 19, 43, 0.3)' }}>
          <p style={{ marginBottom: '0.8rem', fontSize: '1.1rem' }}>Built by <strong>Nandha kumar</strong></p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            <a href="https://github.com/Nandha-kumar07" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', transition: 'text-shadow 0.3s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={20} /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/nandha-kumar-9427b428a?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', transition: 'text-shadow 0.3s', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={20} /> LinkedIn
            </a>
          </div>
        </footer>
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
          }
        }}/>
      </div>
    </AuthProvider>
  );
}

export default App;
