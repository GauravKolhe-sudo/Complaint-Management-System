import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const userEmail = localStorage.getItem("email");

    useEffect(() => {
        const fetchComplaints = async () => {
            if (!userEmail) {
                // If email is missing, user might have old session. specific check.
                // Redirect to login to refresh session data.
                navigate('/login');
                return;
            }

            try {
                const res = await api.get(`/api/complaint/user?email=${userEmail}`);
                setComplaints(res.data);
            } catch (err) {
                console.error("Error fetching complaints:", err);
            }
        };

        fetchComplaints();
    }, [userEmail, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        navigate('/login');
    };

    return (
        <div className="dashboard-layout">
            <header className="top-nav">
                <div className="logo">ComplaintSys</div>
                <div className="nav-actions">
                    <button onClick={handleLogout} className="btn-secondary">Logout</button>
                </div>
            </header>

            <main className="dashboard-content">
                <section className="hero-section">
                    <h1>My Dashboard</h1>
                    <p>Track and manage your submitted complaints.</p>

                    <Link to="/file-complaint" className="btn-primary cta-btn">
                        + File New Complaint
                    </Link>
                </section>

                <section className="stats-row">
                    <div className="stat-card pending">
                        <h3>Pending</h3>
                        <p className="stat-number">
                            {complaints.filter(c => c.status === 'Pending').length}
                        </p>
                    </div>
                    <div className="stat-card resolved">
                        <h3>Resolved</h3>
                        <p className="stat-number">
                            {complaints.filter(c => c.status === 'Completed').length}
                        </p>
                    </div>
                    <div className="stat-card total">
                        <h3>Total</h3>
                        <p className="stat-number">{complaints.length}</p>
                    </div>
                </section>

                <section className="recent-activity">
                    <h2>Recent Complaints</h2>
                    <div className="complaint-list">
                        {complaints.length === 0 ? (
                            <p>No complaints found.</p>
                        ) : (
                            complaints.map((complaint) => (
                                <div key={complaint._id} className="complaint-item">
                                    <div className={`status-badge status-${(complaint.status || 'Pending').toLowerCase()}`}>
                                        {complaint.status || 'Pending'}
                                    </div>
                                    <div className="complaint-info">
                                        <h4>{complaint.title || 'Untitled Complaint'}</h4>
                                        <p>Category: {complaint.category || 'General'}</p>
                                        <p>Submitted on: {new Date(complaint.createdAt).toLocaleDateString()}</p>
                                        {/* Debug helper: show text if title missing */}
                                        {!complaint.title && <p className="text-sm text-gray-500">{complaint.text?.substring(0, 50)}...</p>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;
