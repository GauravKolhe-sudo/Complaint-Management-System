import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const FileComplaint = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('General');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here we would call API. For now, UI demo.
        alert("Complaint Submitted! (Demo)");
        navigate('/dashboard');
    };

    return (
        <div className="page-container">
            <div className="form-card-lg">
                <div className="form-header">
                    <h2>File a Complaint</h2>
                    <p>We are here to help. Please provide details below.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Subject</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Brief title of the issue"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option>General</option>
                            <option>IT Support</option>
                            <option>Maintenance</option>
                            <option>HR</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            rows="5"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the issue in detail..."
                            required
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">Submit Complaint</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FileComplaint;
