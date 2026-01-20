import { useState, useEffect } from 'react';
import WordleGame from '../components/WordleGame';
import api from '../utils/api';

const GamePage = ({ user }) => {
    const [partner, setPartner] = useState(null);
    const [activeGame, setActiveGame] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStatus = async () => {
        try {
            const [coupleRes, gameRes] = await Promise.all([
                api.get('/couple/me'),
                api.get('/game/active')
            ]);

            if (coupleRes.data.coupled) {
                setPartner(coupleRes.data.couple.user1Id === user.id ? coupleRes.data.couple.user2 : coupleRes.data.couple.user1);
            }
            setActiveGame(gameRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, [user.id]);

    const handleCreateGame = async (word) => {
        if (!word) {
            setActiveGame(null);
            return;
        }
        try {
            await api.post('/game', { word });
            fetchStatus();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create game');
        }
    };

    const handleGuess = async (guess) => {
        try {
            await api.post(`/game/${activeGame.id}/guess`, { guess });
            fetchStatus();
        } catch (err) {
            alert('Failed to submit guess');
        }
    };

    const handleDeleteGame = async (id) => {
        if (!window.confirm('Delete this game session?')) return;
        try {
            await api.delete(`/game/${id}`);
            setActiveGame(null);
        } catch (err) {
            alert('Failed to delete game');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading games...</div>;

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 900 }}>Our <span className="gradient-text">Word</span> World</h1>
                <p style={{ color: 'var(--text-light)' }}>Secret words just for us.</p>
            </div>

            <WordleGame
                activeGame={activeGame}
                user={user}
                partnerName={partner?.username}
                onCreate={handleCreateGame}
                onGuess={handleGuess}
                onDelete={handleDeleteGame}
            />
        </div>
    );
};

export default GamePage;
