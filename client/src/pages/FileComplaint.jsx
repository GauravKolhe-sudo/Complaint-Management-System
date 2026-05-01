import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const FileComplaint = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ subject: '', contactNumber: '', description: '', location: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/api/complaints/submit', form);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit complaint. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
        border: '1px solid #e5e7eb', backgroundColor: '#f9fafb',
        fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none'
    };
    const labelStyle = {
        display: 'block', fontSize: '0.7rem', fontWeight: '700',
        color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem'
    };

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', width: '100%', maxWidth: '620px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', textAlign: 'center', marginBottom: '0.4rem', color: '#111827' }}>File a Complaint</h2>
                <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem', fontSize: '0.95rem' }}>We are here to help. Please provide details below.</p>

                {error && (
                    <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.85rem', textAlign: 'center', border: '1px solid #fee2e2' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Row 1: Subject + Contact Number */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div>
                            <label style={labelStyle}>Subject</label>
                            <input
                                name="subject"
                                type="text"
                                placeholder="Brief title of the issue"
                                value={form.subject}
                                onChange={handleChange}
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Contact Number</label>
                            <input
                                name="contactNumber"
                                type="tel"
                                placeholder="Your mobile number"
                                value={form.contactNumber}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Row 2: Description */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={labelStyle}>Description</label>
                        <textarea
                            name="description"
                            rows="5"
                            placeholder="Describe the issue in detail..."
                            value={form.description}
                            onChange={handleChange}
                            style={{ ...inputStyle, resize: 'vertical' }}
                            required
                        />
                    </div>

                    {/* Row 3: Location */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={labelStyle}>Complaint Location</label>
                        <input
                            name="location"
                            type="text"
                            placeholder="Address or area of the issue"
                            value={form.location}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            style={{ flex: 1, padding: '0.85rem', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ flex: 2, padding: '0.85rem', borderRadius: '10px', border: 'none', backgroundColor: loading ? '#a5b4fc' : '#4f46e5', color: 'white', fontWeight: '700', fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer' }}
                        >
                            {loading ? 'Submitting...' : 'Submit Complaint'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FileComplaint;
