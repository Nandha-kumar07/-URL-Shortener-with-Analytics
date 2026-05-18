import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Zap, BarChart3, Lock } from 'lucide-react';

const Home = () => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <section className="hero">
        <h1 className="hero-title">Shorten Your Links,<br/>Expand Your Reach.</h1>
        <p className="hero-subtitle">
          Trimly is the ultimate URL shortener with powerful analytics. Track clicks, location, and device data to optimize your links.
        </p>
        <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
          Get Started for Free
        </Link>
      </section>

      <div className="stats-grid" style={{ marginTop: '2rem' }}>
        <div className="stat-card glass">
          <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><Zap size={40} /></div>
          <h3>Lightning Fast</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Generate short, memorable links instantly with our optimized engine.</p>
        </div>
        <div className="stat-card glass">
          <div style={{ color: 'var(--accent)', marginBottom: '1rem' }}><BarChart3 size={40} /></div>
          <h3>Deep Analytics</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Track every click, measure engagement, and understand your audience.</p>
        </div>
        <div className="stat-card glass">
          <div style={{ color: 'var(--secondary)', marginBottom: '1rem' }}><Lock size={40} /></div>
          <h3>Secure & Private</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Your data is encrypted. We don't sell your info to third parties.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
