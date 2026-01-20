import { useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoId = "hvqc8lPmCfU";

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        }}>
            <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="btn"
                style={{
                    background: isPlaying ? 'var(--primary)' : 'white',
                    color: isPlaying ? 'white' : 'var(--primary)',
                    borderRadius: '50%',
                    width: '56px',
                    height: '56px',
                    padding: '0',
                    boxShadow: '0 8px 24px rgba(255, 77, 109, 0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            >
                {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>

            {isPlaying && (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    padding: '12px 20px',
                    borderRadius: '100px',
                    fontSize: '0.9rem',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    <Music size={16} className="animate-pulse" />

                </div>
            )}

            <div style={{ display: 'none' }}>
                {isPlaying && (
                    <iframe
                        width="100"
                        height="100"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`}
                        allow="autoplay"
                    />
                )}
            </div>
        </div>
    );
};

export default MusicPlayer;
