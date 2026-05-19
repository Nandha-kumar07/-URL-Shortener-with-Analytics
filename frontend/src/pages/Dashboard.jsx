import React, { useState, useEffect } from 'react';

const BASE_SHORT_URL = import.meta.env.VITE_BACKEND_URL || (window.location.port === '5173' ? 'http://localhost:5000' : (window.location.protocol + '//' + window.location.host));
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
      <div className="dashboard-header" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.2rem' }}>Dashboard Overview</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px' }}>
          Manage your links, track their performance, and generate beautiful QR codes all in one place.
        </p>
      </div>

      <div className="url-shortener-card glass">
        <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Generate Short Link</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Paste your long, bulky URL below to instantly transform it into a clean, trackable short link.
        </p>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Destination URL</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="https://example.com/very-long-link..."
              {...register('originalUrl', { 
                required: 'URL is required',
                pattern: {
                  value: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(.*)$/,
                  message: 'Enter a valid URL'
                }
              })}
            />
            {errors.originalUrl && <p className="error-msg">{errors.originalUrl.message}</p>}
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Custom Alias (Optional)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g., my-campaign"
                {...register('customAlias', {
                  pattern: {
                    value: /^[a-zA-Z0-9-_]+$/,
                    message: 'Only letters, numbers, hyphens, underscores'
                  }
                })}
              />
              {errors.customAlias && <p className="error-msg">{errors.customAlias.message}</p>}
            </div>

            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-main)' }}>Expiry Date (Optional)</label>
              <input 
                type="date" 
                className="form-control" 
                {...register('expiresAt')}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem', fontSize: '1.05rem', fontWeight: '700' }} disabled={shortening}>
            {shortening ? 'Generating...' : 'Shorten URL'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '3rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.6rem' }}>Active Links</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Monitor click statistics and manage your active short URLs below.</p>
      </div>
      {urls.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>You haven't created any links yet. Generate your first one above!</p>
        </div>      ) : (
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
              {url.expiresAt && (
                <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.5rem', textAlign: 'center' }}>
                  Expires: {new Date(url.expiresAt).toLocaleString()}
                </div>
              )}
              
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
