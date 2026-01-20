import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogOut } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="logo">
                        <Heart fill="var(--primary)" size={32} />
                        <span>TwoOfUs</span>
                    </Link>

                    <div className="nav-links">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                                <Link to="/draw" className="nav-link">Draw</Link>
                                <Link to="/game" className="nav-link">Games</Link>
                                {user.isAdmin && <Link to="/admin" className="nav-link" style={{ color: 'var(--primary)' }}>Admin</Link>}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginLeft: '10px' }}>
                                    <span className="stat-box" style={{ padding: '8px 15px', minWidth: 'auto' }}>
                                        {user.username}
                                    </span>
                                    <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px' }}>
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-link">Login</Link>
                                <Link to="/signup" className="btn btn-primary" style={{ padding: '10px 20px' }}>Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
