import { Link } from 'react-router-dom';
import { Heart, Palette, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="container">
            <section className="hero">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1>A Private Sanctuary for <span className="gradient-text">Us</span>.</h1>
                    <p>
                        The intimate digital space where you can draw together, play games,
                        and keep your memories safe. Just the two of you.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <Link to="/signup" className="btn btn-primary">Start Our Journey</Link>
                        <Link to="/login" className="btn btn-outline">Sign In</Link>
                    </div>
                </motion.div>
            </section>

            <div className="grid-3">
                {[
                    { icon: <Palette />, title: "Shared Canvas", desc: "Express love through shared doodles." },
                    { icon: <Sparkles />, title: "Wordle Game", desc: "Challenge your partner with inside jokes." },
                    { icon: <Lock />, title: "Private Space", desc: "Encrypted memory timeline for two." }
                ].map((f, i) => (
                    <motion.div
                        key={i}
                        className="feature-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div style={{ color: 'var(--primary)', marginBottom: '15px' }}>{f.icon}</div>
                        <h3>{f.title}</h3>
                        <p>{f.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Home;
