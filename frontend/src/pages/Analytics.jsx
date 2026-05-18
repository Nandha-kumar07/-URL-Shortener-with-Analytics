import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { QRCodeCanvas } from 'qrcode.react';
import { format, subDays, isSameDay } from 'date-fns';
import { ArrowLeft, ExternalLink, Calendar, MapPin, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';

const BASE_SHORT_URL = 'http://localhost:5000';


const Analytics = () => {
  const { shortId } = useParams();
  const [urlData, setUrlData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`/url/${shortId}/analytics`);
        setUrlData(res.data);
      } catch (err) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [shortId]);

  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  if (!urlData) {
    return <div style={{ textAlign: 'center', marginTop: '4rem' }}>URL not found</div>;
  }

  // Process data for charts
  const processChartData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const visitsOnDay = urlData.visitHistory.filter(visit => 
        isSameDay(new Date(visit.timestamp), date)
      ).length;
      
      data.push({
        date: format(date, 'MMM dd'),
        clicks: visitsOnDay
      });
    }
    return data;
  };

  const chartData = processChartData();
  const fullShortUrl = `${BASE_SHORT_URL}/${urlData.shortId}`;

  return (
    <div>
      <div className="analytics-header">
        <Link to="/dashboard" className="btn btn-secondary" style={{ marginBottom: '1rem', display: 'inline-flex', padding: '0.5rem 1rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h2 style={{ fontSize: '2rem' }}>Analytics for {urlData.shortId}</h2>
        <a href={fullShortUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          {fullShortUrl} <ExternalLink size={16} />
        </a>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          Original: {urlData.originalUrl}
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass">
          <p style={{ color: 'var(--text-muted)' }}>Total Clicks</p>
          <div className="stat-value">{urlData.clicks}</div>
        </div>
        <div className="stat-card glass">
          <p style={{ color: 'var(--text-muted)' }}>Created On</p>
          <div className="stat-value" style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
            {format(new Date(urlData.createdAt), 'MMM dd, yyyy')}
          </div>
        </div>
        <div className="stat-card glass">
          <p style={{ color: 'var(--text-muted)' }}>Last Visited</p>
          <div className="stat-value" style={{ fontSize: '1.5rem', marginTop: '1rem' }}>
            {urlData.visitHistory.length > 0 
              ? format(new Date(urlData.visitHistory[urlData.visitHistory.length - 1].timestamp), 'MMM dd, HH:mm')
              : 'Never'}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Clicks (Last 7 Days)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                  itemStyle={{ color: 'var(--primary)' }}
                />
                <Line type="monotone" dataKey="clicks" stroke="var(--primary)" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>QR Code</h3>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '12px' }}>
            <QRCodeCanvas value={fullShortUrl} size={200} />
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>
            Scan to visit the short URL
          </p>
        </div>
      </div>

      <div className="visit-history glass" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Recent Visits</h3>
        {urlData.visitHistory.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No visits recorded yet.</p>
        ) : (
          <div>
            {[...urlData.visitHistory].reverse().slice(0, 50).map((visit, index) => (
              <div key={index} className="visit-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Calendar size={16} color="var(--primary)" />
                  <span>{format(new Date(visit.timestamp), 'MMM dd, yyyy HH:mm:ss')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', color: 'var(--text-muted)' }}>
                  {visit.ip && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={16} /> {visit.ip}
                    </span>
                  )}
                  {visit.userAgent && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={visit.userAgent}>
                      <Monitor size={16} /> {visit.userAgent.split(' ')[0]}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
