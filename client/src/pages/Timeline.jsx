import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Gamepad2, Calendar, Heart, Clock } from 'lucide-react';
import api from '../utils/api';

const Timeline = ({ user }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const { data } = await api.get('/couple/timeline');
                setEvents(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTimeline();
    }, []);

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '100px' }}>Loading our story...</div>;

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <Clock size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
                <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>Our <span className="gradient-text">Timeline</span></h1>
                <p style={{ color: 'var(--text-light)' }}>Every memory we've created together, in one beautiful place.</p>
            </div>

            <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
                {/* Vertical Line */}
                <div style={{ position: 'absolute', left: '50%', top: '0', bottom: '0', width: '2px', background: 'var(--secondary)', transform: 'translateX(-50%)', opacity: 0.3 }} />

                {events.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{
                            display: 'flex',
                            justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start',
                            width: '100%',
                            marginBottom: '40px',
                            position: 'relative'
                        }}
                    >
                        {/* Dot */}
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            top: '20px',
                            width: '16px',
                            height: '16px',
                            background: 'white',
                            border: `4px solid ${event.type === 'drawing' ? 'var(--primary)' : 'var(--text)'}`,
                            borderRadius: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 2
                        }} />

                        <div className="glass-card" style={{
                            width: '45%',
                            padding: '20px',
                            textAlign: 'left',
                            boxShadow: 'var(--shadow)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                {event.type === 'drawing' ? (
                                    <Palette size={20} color="var(--primary)" />
                                ) : (
                                    <Gamepad2 size={20} color="var(--text)" />
                                )}
                                <span style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-light)' }}>
                                    {event.type === 'drawing' ? 'Shared Drawing' : 'Wordle Game'}
                                </span>
                            </div>

                            {event.type === 'drawing' ? (
                                <div style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', border: '1px solid #eee' }}>
                                    <img src={event.imageData} alt="Memory" style={{ width: '100%' }} />
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '10px', background: 'rgba(0,0,0,0.03)', borderRadius: '15px' }}>
                                    <p style={{ margin: 0, fontWeight: 700 }}>WORD: <span style={{ color: 'var(--primary)' }}>{event.word.toUpperCase()}</span></p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '5px' }}>
                                        {event.status === 'completed' ? `Finished in ${event.guesses.length} tries` : 'In progress...'}
                                    </p>
                                </div>
                            )}

                            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Calendar size={12} /> {new Date(event.createdAt).toLocaleDateString()}
                                </span>
                                <Heart size={14} color="var(--primary)" fill={event.type === 'drawing' ? 'var(--primary)' : 'none'} />
                            </div>
                        </div>
                    </motion.div>
                ))}

                {events.length === 0 && (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>Your story is just beginning. Create a drawing or play a game to see it here!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Timeline;
