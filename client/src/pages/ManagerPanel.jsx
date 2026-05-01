import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2, Unknown: 3 };

const priorityColor = (p) =>
    p === 'High' ? '#ef4444' : p === 'Medium' ? '#f59e0b' : p === 'Low' ? '#10b981' : '#9ca3af';

const priorityBg = (p) =>
    p === 'High' ? '#fef2f2' : p === 'Medium' ? '#fffbeb' : p === 'Low' ? '#ecfdf5' : '#f3f4f6';

const ManagerPanel = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [activeTab, setActiveTab] = useState('active');
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => { fetchComplaints(); }, []);

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/api/complaints/all/list');
            if (Array.isArray(res.data)) setComplaints(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/api/complaints/${id}/status`, { status });
            fetchComplaints();
            if (selected?._id === id) setSelected(prev => ({ ...prev, status }));
        } catch (err) { console.error(err); }
    };

    const pendingComplaints = complaints
        .filter(c => c.status === 'PENDING')
        .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3));

    const resolvedComplaints = complaints.filter(c => c.status === 'SOLVED');
    const displayComplaints = activeTab === 'active' ? pendingComplaints : resolvedComplaints;

    const labelStyle = { color: '#9ca3af', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem', fontWeight: '700' };
    const valueStyle = { fontWeight: '600', color: '#111827', fontSize: '0.95rem' };

    return (
        <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <header style={{ padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ color: '#4f46e5', fontWeight: 'bold', fontSize: '1.2rem' }}>Manager Panel</div>
                <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ color: '#ef4444', backgroundColor: '#fef2f2', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Logout</button>
            </header>

            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                    {[['Total Complaints', complaints.length], ['Pending', pendingComplaints.length], ['Resolved', resolvedComplaints.length]].map(([label, val]) => (
                        <div key={label} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                            <div style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{label}</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{val}</div>
                        </div>
                    ))}
                </div>

                {/* Table card */}
                <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            {['active', 'history'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid #4f46e5' : 'none', color: activeTab === tab ? '#4f46e5' : '#6b7280', paddingBottom: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>
                                    {tab === 'active' ? 'Active Complaints' : 'History'}
                                </button>
                            ))}
                        </div>
                        <button onClick={fetchComplaints} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f9fafb', fontSize: '0.85rem', cursor: 'pointer' }}>🔄 Refresh</button>
                    </div>

                    <div style={{ padding: '1.5rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', color: '#9ca3af', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <th style={{ padding: '0.75rem 0' }}>Status</th>
                                    <th style={{ padding: '0.75rem 0' }}>Priority</th>
                                    <th style={{ padding: '0.75rem 0' }}>Subject</th>
                                    <th style={{ padding: '0.75rem 0' }}>Submitted By</th>
                                    <th style={{ padding: '0.75rem 0' }}>Date</th>
                                    <th style={{ padding: '0.75rem 0' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayComplaints.map(c => (
                                    <tr key={c._id} style={{ borderTop: '1px solid #f3f4f6' }}>
                                        <td style={{ padding: '1rem 0' }}>
                                            <span style={{ backgroundColor: c.status === 'SOLVED' ? '#ecfdf5' : '#fffbeb', color: c.status === 'SOLVED' ? '#059669' : '#d97706', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 0' }}>
                                            <span style={{ backgroundColor: priorityBg(c.priority), color: priorityColor(c.priority), padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                {c.priority ?? 'N/A'}
                                            </span>
                                            <span style={{ marginLeft: '0.4rem', fontSize: '0.75rem', color: '#6b7280' }}>
                                                {Math.round((c.confidenceScore ?? 0) * 100)}%
                                            </span>
                                            {(c.confidenceScore ?? 1) < 0.8 && (
                                                <span style={{ marginLeft: '0.3rem', backgroundColor: '#fff7ed', color: '#ea580c', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold' }}>REVIEW</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem 0', fontWeight: '500', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subject}</td>
                                        <td style={{ padding: '1rem 0', color: '#6b7280', fontSize: '0.9rem' }}>{c.email}</td>
                                        <td style={{ padding: '1rem 0', color: '#6b7280', fontSize: '0.85rem' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem 0' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => setSelected(c)} style={{ padding: '0.4rem 0.9rem', borderRadius: '6px', border: '1px solid #4f46e5', background: 'white', color: '#4f46e5', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}>View</button>
                                                {c.status === 'PENDING' && (
                                                    <button onClick={() => updateStatus(c._id, 'SOLVED')} style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none', background: '#f0fdf4', color: '#16a34a', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}>✓ Solve</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {displayComplaints.length === 0 && !loading && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No complaints found in this category.</div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modal */}
            {selected && (
                <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                        {/* Modal Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#111827', marginBottom: '0.4rem' }}>{selected.subject}</h2>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ backgroundColor: selected.status === 'SOLVED' ? '#ecfdf5' : '#fffbeb', color: selected.status === 'SOLVED' ? '#059669' : '#d97706', padding: '0.2rem 0.7rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' }}>{selected.status}</span>
                                    <span style={{ backgroundColor: priorityBg(selected.priority), color: priorityColor(selected.priority), padding: '0.2rem 0.7rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 'bold' }}>{selected.priority ?? 'N/A'} Priority</span>
                                </div>
                            </div>
                            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>✕</button>
                        </div>

                        {/* Description */}
                        <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                            <div style={labelStyle}>Description</div>
                            <p style={{ color: '#374151', lineHeight: '1.7', margin: 0 }}>{selected.description}</p>
                        </div>

                        {/* Info Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                                <div style={labelStyle}>Submitted By</div>
                                <div style={valueStyle}>{selected.email}</div>
                            </div>
                            <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                                <div style={labelStyle}>Contact Number</div>
                                <div style={valueStyle}>{selected.contactNumber || '—'}</div>
                            </div>
                            <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                                <div style={labelStyle}>Location</div>
                                <div style={valueStyle}>{selected.location || '—'}</div>
                            </div>
                            <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                                <div style={labelStyle}>Date Submitted</div>
                                <div style={valueStyle}>{new Date(selected.createdAt).toLocaleString()}</div>
                            </div>
                        </div>

                        {/* AI Analysis */}
                        <div style={{ border: '1px solid #e0e7ff', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.5rem', backgroundColor: '#f5f3ff' }}>
                            <div style={{ ...labelStyle, color: '#6d28d9' }}>AI Analysis</div>
                            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#7c3aed', marginBottom: '0.2rem' }}>Priority</div>
                                    <div style={{ fontWeight: '700', color: priorityColor(selected.priority), fontSize: '1.1rem' }}>{selected.priority ?? 'N/A'}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#7c3aed', marginBottom: '0.2rem' }}>Confidence Score</div>
                                    <div style={{ fontWeight: '700', color: '#4f46e5', fontSize: '1.1rem' }}>{Math.round((selected.confidenceScore ?? 0) * 100)}%</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#7c3aed', marginBottom: '0.2rem' }}>Category</div>
                                    <div style={{ fontWeight: '700', color: '#374151', fontSize: '1rem' }}>{selected.category || 'Uncategorized'}</div>
                                </div>
                            </div>
                            {(selected.confidenceScore ?? 1) < 0.8 && (
                                <div style={{ marginTop: '0.75rem', backgroundColor: '#fff7ed', color: '#ea580c', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600' }}>
                                    ⚠ Low confidence — manual review recommended
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => setSelected(null)} style={{ padding: '0.6rem 1.5rem', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', fontWeight: '600' }}>Close</button>
                            {selected.status === 'PENDING' && (
                                <button onClick={() => updateStatus(selected._id, 'SOLVED')} style={{ padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none', background: '#16a34a', color: 'white', cursor: 'pointer', fontWeight: '600' }}>✓ Mark as Solved</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerPanel;
