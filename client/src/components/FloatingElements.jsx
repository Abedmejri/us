import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const FloatingElements = () => {
    const elements = [...Array(12)]; // Mix of hearts and flowers

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -1, overflow: 'hidden' }}>
            {elements.map((_, i) => {
                const isHeart = i % 2 === 0;
                const size = 30 + Math.random() * 50;
                const duration = 15 + Math.random() * 15;
                const delay = Math.random() * 20;

                return (
                    <motion.div
                        key={i}
                        initial={{
                            y: '110vh',
                            x: `${Math.random() * 100}vw`,
                            rotateX: 0,
                            rotateY: 0,
                            opacity: 0.1
                        }}
                        animate={{
                            y: '-10vh',
                            x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
                            rotateX: [0, 360, 720],
                            rotateY: [0, 180, 0],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            delay: delay,
                            ease: "linear"
                        }}
                        style={{ position: 'absolute' }}
                    >
                        {isHeart ? (
                            <Heart
                                size={size}
                                fill={i % 3 === 0 ? 'var(--primary)' : 'var(--secondary)'}
                                color="none"
                                style={{ filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))' }}
                            />
                        ) : (
                            /* Simple SVG Flower */
                            <svg width={size} height={size} viewBox="0 0 24 24" fill={i % 4 === 0 ? '#ffb7c5' : '#ff9aa2'}>
                                <path d="M12,2L14.7,6.8L19.8,5.2L17.5,10L22,12L17.5,14L19.8,18.8L14.7,17.2L12,22L9.3,17.2L4.2,18.8L6.5,14L2,12L6.5,10L4.2,5.2L9.3,6.8L12,2Z" />
                                <circle cx="12" cy="12" r="3" fill="#ffd700" />
                            </svg>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};

export default FloatingElements;
