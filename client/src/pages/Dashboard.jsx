import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const email = localStorage.getItem('email');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/api/complaints/my');
            if (Array.isArray(res.data)) {
                setComplaints(res.data);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const pendingCount = complaints.filter(c => c.status === 'PENDING').length;
    const resolvedCount = complaints.filter(c => c.status === 'SOLVED').length;

    return (
        <div className="dashboard-layout" style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <header className="top-nav" style={{ padding: '0.75rem 2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="logo" style={{ color: '#4f46e5', fontWeight: 'bold', fontSize: '1.2rem' }}>Complaint Management System</div>
                <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', color: '#6b7280' }}>{email}</span>
                    <button onClick={handleLogout} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}>Logout</button>
                </div>
            </header>

            <main className="dashboard-content" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>Welcome back!</h1>
                        <p style={{ color: '#6b7280' }}>You have {pendingCount} pending complaints.</p>
                    </div>
                    <Link to="/file-complaint" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>+</span> New Complaint
                    </Link>
                </div>

                <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderRadius: '16px', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#fffbeb' }}></div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{pendingCount}</div>
                            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Pending</div>
                        </div>
                    </div>
                    <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderRadius: '16px', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#ecfdf5' }}></div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{resolvedCount}</div>
                            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Resolved</div>
                        </div>
                    </div>
                    <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', borderRadius: '16px', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f5f3ff' }}></div>
                        <div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{complaints.length}</div>
                            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Total</div>
                        </div>
                    </div>
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Your Complaints</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {complaints.map(complaint => (
                        <div key={complaint._id} className="complaint-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #f3f4f6', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ 
                                    backgroundColor: complaint.status === 'SOLVED' ? '#ecfdf5' : '#fffbeb', 
                                    color: complaint.status === 'SOLVED' ? '#059669' : '#d97706',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold'
                                }}>{complaint.status}</span>
                                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{complaint.subject}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {complaint.description}
                            </p>
                            <Link to={`/complaint/${complaint._id}`} style={{ color: '#4f46e5', fontWeight: '600', fontSize: '0.85rem' }}>View Details →</Link>
                        </div>
                    ))}
                    {complaints.length === 0 && !loading && (
                        <p style={{ color: '#6b7280' }}>No complaints found. File a new one to get started!</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

