import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Copy, Check, Users } from 'lucide-react';
import api from '../utils/api';

const Invite = ({ user }) => {
    const [inviteCode, setInviteCode] = useState('');
    const [targetCode, setTargetCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const { data } = await api.get('/couple/me');
                if (data.coupled) navigate('/dashboard');
                else setInviteCode(data.inviteCode);
            } catch (err) { }
        };
        checkStatus();
    }, [navigate]);

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        try {
            await api.post('/couple/join', { inviteCode: targetCode });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join');
        }
    };

    return (
        <div className="container" style={{ padding: '60px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>Connect with Your Partner</h1>
                <p style={{ color: 'var(--text-light)', fontSize: '1.2rem' }}>Share your secret code to create your world.</p>
            </div>

            <div className="grid-3" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <div style={{ background: 'var(--background)', padding: '20px', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyCenter: 'center', margin: '0 auto 20px' }}>
                        <Heart size={40} color="var(--primary)" fill="var(--primary)" />
                    </div>
                    <h3>Your Invite Code</h3>
                    <div style={{ position: 'relative', marginTop: '20px' }}>
                        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', fontSize: '2rem', fontWeight: 900, letterSpacing: '5px', color: 'var(--primary)', border: '2px dashed var(--secondary)' }}>
                            {inviteCode}
                        </div>
                        <button onClick={handleCopy} className="btn" style={{ position: 'absolute', right: '-10px', top: '-10px', background: 'white', padding: '10px', boxShadow: 'var(--shadow)' }}>
                            {copied ? <Check color="green" /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>

                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <div style={{ background: '#e3f2fd', padding: '20px', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyCenter: 'center', margin: '0 auto 20px' }}>
                        <Users size={40} color="#2196f3" />
                    </div>
                    <h3>Join Partner</h3>
                    <form onSubmit={handleJoin} style={{ marginTop: '20px' }}>
                        <input
                            className="input-field"
                            placeholder="ENTER CODE"
                            style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '2px' }}
                            value={targetCode}
                            onChange={(e) => setTargetCode(e.target.value.toUpperCase())}
                        />
                        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }}>Connect Now</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Invite;
