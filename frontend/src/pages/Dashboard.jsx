import React, { useState, useEffect } from 'react';

const BASE_SHORT_URL = 'http://localhost:5000';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Copy, Trash2, ExternalLink, BarChart2 } from 'lucide-react';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [shortening, setShortening] = useState(false);

  const fetchUrls = async () => {
    try {
      const res = await axios.get('/url');
      setUrls(res.data);
    } catch (err) {
      toast.error('Failed to load URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const onSubmit = async (data) => {
    setShortening(true);
    try {
      const res = await axios.post('/url/shorten', data);
      setUrls([res.data, ...urls]);
      reset();
      toast.success('URL Shortened!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Error shortening URL');
    } finally {
      setShortening(false);
    }
  };

  const deleteUrl = async (shortId) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;
    try {
      await axios.delete(`/url/${shortId}`);
      setUrls(urls.filter(url => url.shortId !== shortId));
      toast.success('URL deleted');
    } catch (err) {
      toast.error('Error deleting URL');
    }
  };

  const copyToClipboard = (shortId) => {
    const fullUrl = `${BASE_SHORT_URL}/${shortId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Copied to clipboard!');
  };

  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  return (
    <div>
      <div className="dashboard-header">
        <h2>Your Dashboard</h2>
      </div>

      <div className="url-shortener-card glass">
        <h3>Create New Short Link</h3>
        <form className="url-form" onSubmit={handleSubmit(onSubmit)}>
          <div style={{ flex: 1 }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Paste long URL here (e.g., https://example.com)"
              {...register('originalUrl', { 
                required: 'URL is required',
                pattern: {
                  value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                  message: 'Enter a valid URL'
                }
              })}
            />
            {errors.originalUrl && <p className="error-msg">{errors.originalUrl.message}</p>}
          </div>
          
          <div style={{ flex: 0.5 }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Custom alias (optional)"
              {...register('customAlias', {
                pattern: {
                  value: /^[a-zA-Z0-9-_]+$/,
                  message: 'Only letters, numbers, hyphens, underscores'
                }
              })}
            />
            {errors.customAlias && <p className="error-msg">{errors.customAlias.message}</p>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={shortening}>
            {shortening ? 'Shortening...' : 'Shorten'}
          </button>
        </form>
      </div>

      <h3>Your Links</h3>
      {urls.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>You haven't created any links yet.</p>
      ) : (
        <div className="url-list" style={{ marginTop: '1rem' }}>
          {urls.map(url => (
            <div key={url._id} className="url-card glass">
              <div className="url-card-header">
                <span className="url-short">
                  Trimly/{url.shortId}
                </span>
                <div className="url-actions">
                  <button onClick={() => copyToClipboard(url.shortId)} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '6px' }} title="Copy">
                    <Copy size={16} />
                  </button>
                  <a href={`${BASE_SHORT_URL}/${url.shortId}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '6px' }} title="Visit">
                    <ExternalLink size={16} />
                  </a>
                  <button onClick={() => deleteUrl(url.shortId)} className="btn btn-danger" style={{ padding: '0.4rem', borderRadius: '6px' }} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="url-original" title={url.originalUrl}>
                {url.originalUrl}
              </div>

              <div className="url-stats">
                <span>{new Date(url.createdAt).toLocaleDateString()}</span>
                <span>{url.clicks} clicks</span>
              </div>
              
              <Link to={`/analytics/${url.shortId}`} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.5rem' }}>
                <BarChart2 size={16} /> View Analytics
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
