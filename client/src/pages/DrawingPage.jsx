import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DrawingCanvas from '../components/DrawingCanvas';
import api from '../utils/api';
import { Heart, MessageCircle, Trash2 } from 'lucide-react';

const DrawingPage = ({ user }) => {
    const [partner, setPartner] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coupleRes, drawingRes] = await Promise.all([
                    api.get('/couple/me'),
                    api.get('/drawing')
                ]);

                if (coupleRes.data.coupled) {
                    setPartner(coupleRes.data.couple.user1Id === user.id ? coupleRes.data.couple.user2 : coupleRes.data.couple.user1);
                }
                setHistory(drawingRes.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);

    const handleSendDrawing = async (imageData) => {
        try {
            const { data } = await api.post('/drawing', { imageData });
            setHistory([data, ...history]);
        } catch (err) {
            alert('Failed to send drawing');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this masterpiece?')) return;
        try {
            await api.delete(`/drawing/${id}`);
            setHistory(history.filter(d => d.id !== id));
        } catch (err) {
            alert('Failed to delete');
        }
    };

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>Our Shared Canvas</h1>
                <p style={{ color: 'var(--text-light)' }}>Draw something sweet for {partner?.username || 'your partner'}</p>
            </div>

            <DrawingCanvas
                onSend={handleSendDrawing}
                partnerName={partner?.username}
            />

            <section style={{ marginTop: '80px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--text-light)' }}>Recent Masterpieces</h2>

                <div className="grid-3">
                    <AnimatePresence>
                        {history.map((drawing) => (
                            <motion.div
                                key={drawing.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card"
                                style={{ padding: '15px' }}
                            >
                                <div style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', border: '1px solid #eee', marginBottom: '15px' }}>
                                    <img src={drawing.imageData} alt="Secret drawing" style={{ width: '100%', display: 'block' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)' }}>
                                        {new Date(drawing.createdAt).toLocaleDateString()}
                                    </span>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <Heart size={18} color="var(--primary)" />
                                        {(user.isAdmin || drawing.senderId === user.id) && (
                                            <button
                                                onClick={() => handleDelete(drawing.id)}
                                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#ff4d6d' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                        <MessageCircle size={18} color="var(--text-light)" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
};

export default DrawingPage;
