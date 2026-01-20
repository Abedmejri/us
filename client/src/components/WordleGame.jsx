import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tally5, RotateCcw, Trash2 } from 'lucide-react';

const WordleGame = ({ activeGame, onGuess, onCreate, onDelete, user, partnerName }) => {
    const [currentGuess, setCurrentGuess] = useState('');
    const [wordToCreate, setWordToCreate] = useState('');

    if (!activeGame) {
        return (
            <div className="glass-card" style={{ maxWidth: '450px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ background: 'var(--text)', color: 'white', width: '80px', height: '80px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', rotate: '12deg' }}>
                    <Tally5 size={40} />
                </div>
                <h2>Challenge {partnerName || 'Parter'}</h2>
                <p style={{ color: 'var(--text-light)', marginBottom: '30px' }}>Choose a 5-letter word</p>

                <form onSubmit={(e) => { e.preventDefault(); onCreate(wordToCreate); }}>
                    <input
                        maxLength={5}
                        className="input-field"
                        style={{ textAlign: 'center', fontSize: '2rem', letterSpacing: '5px', fontWeight: 900, marginBottom: '20px' }}
                        placeholder="WORD"
                        value={wordToCreate}
                        onChange={(e) => setWordToCreate(e.target.value.toUpperCase())}
                        required
                    />
                    <button className="btn btn-primary" style={{ width: '100%' }}>Start Game</button>
                </form>
            </div>
        );
    }

    const isGuesser = activeGame.creatorId !== user.id;
    const boardSize = 6;
    const wordLength = activeGame.word.length;

    return (
        <div style={{ maxWidth: '450px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px', position: 'relative' }}>
                <h2>{isGuesser ? `Guess the Word` : `Waiting for ${partnerName}...`}</h2>
                <p style={{ color: 'var(--text-light)' }}>{activeGame.guesses.length} / 6 tries</p>
                {(user.isAdmin || activeGame.creatorId === user.id) && (
                    <button
                        onClick={() => onDelete(activeGame.id)}
                        className="btn"
                        style={{ position: 'absolute', right: '-20px', top: '0', background: 'transparent', color: '#ff4d6d', padding: '5px' }}
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeGame.guesses.map((g, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        {g.guess.split('').map((char, j) => (
                            <div key={j} style={{
                                width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, color: 'white', textTransform: 'uppercase',
                                background: g.result[j] === 2 ? '#10b981' : g.result[j] === 1 ? '#f59e0b' : '#94a3b8'
                            }}>
                                {char}
                            </div>
                        ))}
                    </div>
                ))}

                {isGuesser && activeGame.status === 'active' && activeGame.guesses.length < boardSize && (
                    <form onSubmit={(e) => { e.preventDefault(); onGuess(currentGuess); setCurrentGuess(''); }} style={{ display: 'flex', gap: '10px', justifyContent: 'center', position: 'relative' }}>
                        {[...Array(wordLength)].map((_, i) => (
                            <div key={i} style={{ width: '50px', height: '50px', borderRadius: '12px', border: '2px solid var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900 }}>
                                {currentGuess[i] || ''}
                            </div>
                        ))}
                        <input
                            autoFocus
                            maxLength={5}
                            value={currentGuess}
                            onChange={e => setCurrentGuess(e.target.value.toLowerCase())}
                            style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%' }}
                        />
                    </form>
                )}
            </div>

            {activeGame.status === 'completed' && (
                <div className="glass-card" style={{ marginTop: '40px', textAlign: 'center' }}>
                    <h3>Game Over</h3>
                    <p style={{ fontSize: '1.5rem', fontWeight: 900, margin: '15px 0' }}>Word was: <span style={{ color: 'var(--primary)' }}>{activeGame.word.toUpperCase()}</span></p>
                    <button onClick={() => onCreate(null)} className="btn btn-outline" style={{ margin: '0 auto' }}>
                        <RotateCcw size={18} /> New Game
                    </button>
                </div>
            )}
        </div>
    );
};

export default WordleGame;
