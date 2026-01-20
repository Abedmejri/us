import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Palette, Gamepad2, Heart, Clock, MessageCircle, Quote, Sparkles, BookHeart, Loader2 } from 'lucide-react';
import api from '../utils/api';

const Dashboard = ({ user }) => {
    const [coupleData, setCoupleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [poem, setPoem] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    const fetchAiQuote = async () => {
        setAiLoading(true);
        try {
            const { data } = await api.get('/ai/quote');
            setPoem(data.quote);
        } catch (err) {
            console.error('Failed to fetch AI quote:', err);
            setPoem("You are the most beautiful part of my world."); // Fallback
        } finally {
            setAiLoading(false);
        }
    };

    useEffect(() => {
        const fetchCoupleData = async () => {
            try {
                const { data } = await api.get('/couple/me');
                if (data.coupled) {
                    setCoupleData(data.couple);
                    fetchAiQuote();
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCoupleData();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontSize: '1.2rem', color: 'var(--text-light)' }}>Loading our world...</div>;

    const partner = coupleData?.user1Id === user.id ? coupleData?.user2 : coupleData?.user1;

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <section className="glass-card welcome-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Hi, {user.username}! 👋</h1>
                        {partner ? (
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                Connected with <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{partner.username}</span> <Heart size={20} fill="var(--primary)" />
                            </p>
                        ) : (
                            <p>Waiting for your partner...</p>
                        )}
                    </div>

                    <div className="stats-container">
                        <div className="stat-box">
                            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-light)' }}>MEMORIES</p>
                            <p className="stat-value">0</p>
                        </div>
                    </div>
                </div>

                {/* AI Poetry Corner */}
                {partner && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,179,193,0.1))',
                            padding: '30px',
                            borderRadius: '30px',
                            border: '1px solid var(--secondary)',
                            marginTop: '10px',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'absolute', right: '-20px', top: '-10px', opacity: 0.1 }}>
                            <BookHeart size={120} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <Quote size={24} className="text-primary" fill="var(--primary)" />
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>AI-Powered Romance</h3>
                        </div>

                        <div style={{ minHeight: '60px', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                            {aiLoading ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-light)' }}>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Whispering to the stars...</span>
                                </div>
                            ) : (
                                <p style={{
                                    fontSize: '1.3rem',
                                    fontWeight: 700,
                                    lineHeight: '1.6',
                                    color: 'var(--text)',
                                    fontStyle: 'italic',
                                    margin: 0
                                }}>
                                    "{poem}"
                                </p>
                            )}
                        </div>

                        <button
                            onClick={fetchAiQuote}
                            className="btn btn-outline"
                            style={{ marginTop: '20px', padding: '8px 20px', fontSize: '0.9rem', gap: '8px' }}
                            disabled={aiLoading}
                        >
                            <Sparkles size={16} />
                            {aiLoading ? 'Generating...' : 'New AI Sweet Word'}
                        </button>
                    </motion.div>
                )}
            </section>

            <div className="grid-3">
                <Link to="/draw" style={{ textDecoration: 'none' }}>
                    <motion.div whileHover={{ y: -10 }} className="feature-card" style={{ background: 'var(--primary)', color: 'white', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Palette size={40} style={{ marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '1.8rem' }}>Drawing Space</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)' }}>Share a doodle</p>
                    </motion.div>
                </Link>

                <Link to="/game" style={{ textDecoration: 'none' }}>
                    <motion.div whileHover={{ y: -10 }} className="feature-card" style={{ background: 'var(--text)', color: 'white', minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Gamepad2 size={40} style={{ marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '1.8rem' }}>Play Wordle</h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Guess the word</p>
                    </motion.div>
                </Link>

                <Link to="/timeline" style={{ textDecoration: 'none' }}>
                    <motion.div whileHover={{ y: -10 }} className="feature-card" style={{ minHeight: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Clock size={40} style={{ marginBottom: '20px', color: 'var(--primary)' }} />
                        <h2 style={{ fontSize: '1.8rem' }}>Timeline</h2>
                        <p style={{ color: 'var(--text-light)' }}>See our journey</p>
                    </motion.div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
