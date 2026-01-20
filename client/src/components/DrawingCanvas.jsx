import { useRef, useEffect, useState } from 'react';
import { Trash2, Send, Eraser } from 'lucide-react';

const DrawingCanvas = ({ onSend, partnerName }) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ff4d6d');
    const [brushSize, setBrushSize] = useState(5);
    const [isEraser, setIsEraser] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = canvas.offsetWidth * 2;
        canvas.height = canvas.offsetHeight * 2;
        canvas.style.width = `${canvas.offsetWidth}px`;
        canvas.style.height = `${canvas.offsetHeight}px`;

        const context = canvas.getContext('2d');
        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.lineWidth = brushSize;
        contextRef.current = context;

        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = isEraser ? '#FFFFFF' : color;
            contextRef.current.lineWidth = brushSize;
        }
    }, [color, brushSize, isEraser]);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="drawing-toolbar glass-card" style={{ padding: '15px 25px' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    {['#ff4d6d', '#3b82f6', '#10b981', '#000000'].map(c => (
                        <button
                            key={c}
                            onClick={() => { setColor(c); setIsEraser(false); }}
                            style={{ width: '30px', height: '30px', borderRadius: '50%', background: c, border: color === c && !isEraser ? '3px solid white' : 'none', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                        />
                    ))}
                    <div style={{ width: '2px', height: '30px', background: '#eee' }} />
                    <button
                        onClick={() => setIsEraser(!isEraser)}
                        className="btn"
                        style={{ padding: '8px', background: isEraser ? 'var(--primary)' : '#eee', color: isEraser ? 'white' : 'inherit' }}
                    >
                        <Eraser size={20} />
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={clearCanvas} className="btn btn-outline" style={{ padding: '10px 15px' }}>
                        <Trash2 size={20} />
                    </button>
                    <button onClick={() => onSend(canvasRef.current.toDataURL())} className="btn btn-primary">
                        <Send size={20} /> Send
                    </button>
                </div>
            </div>

            <div className="canvas-container" style={{ border: '1px solid var(--glass-border)' }}>
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={() => setIsDrawing(false)}
                    onMouseMove={draw}
                    onMouseLeave={() => setIsDrawing(false)}
                    style={{ width: '100%', height: '500px', cursor: 'crosshair', display: 'block' }}
                />
            </div>
        </div>
    );
};

export default DrawingCanvas;
