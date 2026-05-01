import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const priorityColor = (p) =>
    p === 'High' ? '#ef4444' : p === 'Medium' ? '#f59e0b' : p === 'Low' ? '#10b981' : '#9ca3af';

const ComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/complaints/${id}`)
            .then(res => { setComplaint(res.data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, [id]);

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
    if (!complaint) return <div style={{ padding: '2rem' }}>Complaint not found</div>;

    const labelStyle = { color: '#9ca3af', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem', fontWeight: '700' };
    const valueStyle = { fontWeight: '600', color: '#111827', fontSize: '0.95rem' };

    return (
        <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '2rem' }}>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', maxWidth: '800px', margin: '0 auto' }}>
                <button onClick={() => navigate(-1)} style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.95rem' }}>← Back</button>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111827', margin: 0 }}>{complaint.subject}</h2>
                    <span style={{ backgroundColor: complaint.status === 'SOLVED' ? '#ecfdf5' : '#fffbeb', color: complaint.status === 'SOLVED' ? '#059669' : '#d97706', padding: '0.4rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        {complaint.status}
                    </span>
                </div>

                {/* Description */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={labelStyle}>Description</div>
                    <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '1rem', margin: 0 }}>{complaint.description}</p>
                </div>

                {/* Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                        <div style={labelStyle}>Contact Number</div>
                        <div style={valueStyle}>{complaint.contactNumber || '—'}</div>
                    </div>
                    <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                        <div style={labelStyle}>Location</div>
                        <div style={valueStyle}>{complaint.location || '—'}</div>
                    </div>
                    <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                        <div style={labelStyle}>Date Submitted</div>
                        <div style={valueStyle}>{new Date(complaint.createdAt).toLocaleString()}</div>
                    </div>
                    <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '1rem 1.25rem' }}>
                        <div style={labelStyle}>Last Updated</div>
                        <div style={valueStyle}>{new Date(complaint.updatedAt).toLocaleString()}</div>
                    </div>
                </div>

                {/* AI Analysis */}
                <div style={{ border: '1px solid #e0e7ff', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#f5f3ff' }}>
                    <div style={{ ...labelStyle, color: '#6d28d9', marginBottom: '0.75rem' }}>AI Analysis</div>
                    <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: '#7c3aed', marginBottom: '0.2rem' }}>Priority</div>
                            <div style={{ fontWeight: '700', color: priorityColor(complaint.priority), fontSize: '1.1rem' }}>{complaint.priority ?? 'N/A'}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: '#7c3aed', marginBottom: '0.2rem' }}>Confidence Score</div>
                            <div style={{ fontWeight: '700', color: '#4f46e5', fontSize: '1.1rem' }}>{Math.round((complaint.confidenceScore ?? 0) * 100)}%</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: '#7c3aed', marginBottom: '0.2rem' }}>Category</div>
                            <div style={{ fontWeight: '700', color: '#374151', fontSize: '1rem' }}>{complaint.category || 'Uncategorized'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetails;
