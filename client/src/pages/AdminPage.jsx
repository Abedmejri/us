import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Trash2, ShieldAlert, RefreshCw, Search } from 'lucide-react';
import api from '../utils/api';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id, username) => {
        if (!window.confirm(`Are you SURE you want to delete ${username}? This will wipe their drawings, games, and break their couple connection.`)) return;

        setActionLoading(true);
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert('Failed to delete user');
        } finally {
            setActionLoading(false);
        }
    };

    const handleResetDB = async () => {
        if (!window.confirm('🚨 WARNING: This will delete ALL users, drawings, games, and couples except for the admin. THIS CANNOT BE UNDONE. Proceed?')) return;

        setActionLoading(true);
        try {
            await api.post('/admin/reset');
            window.location.reload();
        } catch (err) {
            alert('Reset failed');
        } finally {
            setActionLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '100px' }}>Loading control center...</div>;

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}
            >
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text)' }}>
                        Control <span className="gradient-text">Center</span>
                    </h1>
                    <p style={{ color: 'var(--text-light)' }}>Administer the sanctuary and all its inhabitants.</p>
                </div>

                <button
                    onClick={handleResetDB}
                    className="btn btn-outline"
                    style={{ borderColor: '#ff4d6d', color: '#ff4d6d', gap: '8px' }}
                    disabled={actionLoading}
                >
                    <ShieldAlert size={20} /> Nuclear Reset
                </button>
            </motion.div>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Users color="var(--primary)" />
                        <h3 style={{ margin: 0 }}>Registered Inhabitants ({users.length})</h3>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                        <input
                            placeholder="Search users..."
                            className="input-field"
                            style={{ padding: '10px 15px 10px 40px', fontSize: '0.9rem', width: '250px' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'rgba(0,0,0,0.02)', textAlign: 'left' }}>
                            <tr>
                                <th style={{ padding: '15px 20px' }}>User</th>
                                <th style={{ padding: '15px 20px' }}>Invite Code</th>
                                <th style={{ padding: '15px 20px' }}>Couple Status</th>
                                <th style={{ padding: '15px 20px' }}>Joined</th>
                                <th style={{ padding: '15px 20px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredUsers.map((u) => (
                                    <motion.tr
                                        key={u.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                                    >
                                        <td style={{ padding: '15px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '35px', height: '35px', borderRadius: '10px', background: u.isAdmin ? 'var(--primary)' : '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: u.isAdmin ? 'white' : 'inherit' }}>
                                                    {u.isAdmin ? <ShieldAlert size={18} /> : <User size={18} />}
                                                </div>
                                                <span style={{ fontWeight: u.isAdmin ? '900' : '600' }}>{u.username} {u.isAdmin && '(Admin)'}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '15px 20px' }}>
                                            <code style={{ background: 'rgba(0,0,0,0.05)', padding: '4px 8px', borderRadius: '5px' }}>{u.inviteCode}</code>
                                        </td>
                                        <td style={{ padding: '15px 20px' }}>
                                            {u.coupleId ? (
                                                <span style={{ color: '#10b981', fontWeight: 700 }}>Coupled</span>
                                            ) : (
                                                <span style={{ color: 'var(--text-light)' }}>Solo</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '15px 20px', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                                            {!u.isAdmin && (
                                                <button
                                                    onClick={() => handleDeleteUser(u.id, u.username)}
                                                    className="btn"
                                                    style={{ padding: '8px', background: 'transparent', color: '#ff4d6d' }}
                                                    disabled={actionLoading}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-light)' }}>
                            No users found matching your search.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
