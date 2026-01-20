import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, User, Lock } from 'lucide-react';
import api from '../utils/api';

const Signup = ({ setUser }) => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/signup', formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            navigate('/invite');
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container auth-page">
            <div className="glass-card auth-form">
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <Heart fill="var(--primary)" color="var(--primary)" size={48} style={{ marginBottom: '15px' }} />
                    <h2>Join the Sanctuary</h2>
                    <p style={{ color: 'var(--text-light)' }}>Create your private couple space</p>
                </div>

                {error && <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                className="input-field"
                                style={{ paddingLeft: '45px' }}
                                placeholder="Unique name"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="password"
                                className="input-field"
                                style={{ paddingLeft: '45px' }}
                                placeholder="Secret key"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Starting...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>
                    Already signed up? <Link to="/login" style={{ color: 'var(--primary)' }}>Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
