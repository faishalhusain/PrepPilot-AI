import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'motion/react'
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import {
    FaArrowLeft, FaEdit, FaSave, FaTimes,
    FaUserAstronaut
} from 'react-icons/fa'
import {
    BsCoin, BsTrophy, BsBarChart, BsCalendar3,
    BsLightningChargeFill, BsCheckCircleFill,
    BsBriefcase, BsPersonBadge
} from 'react-icons/bs'

const AVATAR_COLORS = [
    '#4ade80', '#60a5fa', '#f472b6', '#fb923c',
    '#a78bfa', '#34d399', '#fbbf24', '#f87171'
]

function Profile() {
    const { userData } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [stats, setStats] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    // Edit form state
    const [editName, setEditName] = useState('')
    const [editBio, setEditBio] = useState('')
    const [editColor, setEditColor] = useState('#4ade80')

    useEffect(() => {
        if (userData) {
            setEditName(userData.name || '')
            setEditBio(userData.bio || '')
            setEditColor(userData.avatarColor || '#4ade80')
        }
    }, [userData])

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const result = await axios.get(
                    serverUrl + "/api/user/profile-stats",
                    { withCredentials: true }
                )
                setStats(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchStats()
    }, [])

    const handleSave = async () => {
        if (!editName.trim()) return
        setSaving(true)
        try {
            const result = await axios.put(
                serverUrl + "/api/user/update-profile",
                { name: editName, bio: editBio, avatarColor: editColor },
                { withCredentials: true }
            )
            dispatch(setUserData(result.data))
            setSaveSuccess(true)
            setIsEditing(false)
            setTimeout(() => setSaveSuccess(false), 3000)
        } catch (error) {
            console.log(error)
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        setEditName(userData?.name || '')
        setEditBio(userData?.bio || '')
        setEditColor(userData?.avatarColor || '#4ade80')
        setIsEditing(false)
    }

    const memberSince = userData?.createdAt
        ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recently'

    const accentColor = isEditing ? editColor : (userData?.avatarColor || '#4ade80')

    return (
        <div style={{ minHeight: '100vh', background: '#06060a', padding: '32px 20px' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

                .pp-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 24px;
                    padding: 28px;
                }
                .pp-input {
                    width: 100%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.09);
                    border-radius: 12px;
                    padding: 12px 16px;
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s;
                    box-sizing: border-box;
                }
                .pp-input:focus {
                    border-color: rgba(74,222,128,0.4);
                    background: rgba(74,222,128,0.03);
                }
                .pp-input::placeholder { color: rgba(255,255,255,0.2); }
                .pp-textarea {
                    width: 100%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.09);
                    border-radius: 12px;
                    padding: 12px 16px;
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    outline: none;
                    resize: none;
                    min-height: 80px;
                    transition: border-color 0.2s, background 0.2s;
                    box-sizing: border-box;
                    line-height: 1.6;
                }
                .pp-textarea:focus {
                    border-color: rgba(74,222,128,0.4);
                    background: rgba(74,222,128,0.03);
                }
                .pp-textarea::placeholder { color: rgba(255,255,255,0.2); }
                .stat-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 18px;
                    padding: 20px 22px;
                    transition: border-color 0.25s, transform 0.25s;
                }
                .stat-card:hover {
                    border-color: rgba(74,222,128,0.2);
                    transform: translateY(-2px);
                }
                .activity-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px 0;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    gap: 12px;
                }
                .activity-row:last-child { border-bottom: none; }
                .color-dot {
                    width: 28px; height: 28px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: transform 0.15s, box-shadow 0.15s;
                    border: 2px solid transparent;
                    flex-shrink: 0;
                }
                .color-dot:hover { transform: scale(1.15); }
                .success-toast {
                    position: fixed;
                    bottom: 28px; right: 28px;
                    background: rgba(74,222,128,0.12);
                    border: 1px solid rgba(74,222,128,0.3);
                    border-radius: 14px;
                    padding: 14px 20px;
                    display: flex; align-items: center; gap: 10px;
                    z-index: 999;
                    animation: fadeIn 0.3s ease;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                }
            `}</style>

            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                {/* ── HEADER ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '36px' }}>
                    <motion.button
                        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/")}
                        style={{
                            width: '42px', height: '42px', borderRadius: '50%',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', flexShrink: 0
                        }}
                    >
                        <FaArrowLeft size={14} />
                    </motion.button>
                    <div>
                        <h1 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '26px', color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
                            My Profile
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', margin: '3px 0 0' }}>
                            Manage your account and view your performance
                        </p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'start' }}>

                    {/* ── LEFT: PROFILE CARD ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Avatar + Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className='pp-card'
                            style={{
                                textAlign: 'center', position: 'relative',
                                borderColor: `${accentColor}25`,
                                background: `rgba(${accentColor === '#4ade80' ? '74,222,128' : '255,255,255'},0.03)`
                            }}
                        >
                            {/* Top glow */}
                            <div style={{
                                position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
                                background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`
                            }} />

                            {/* Avatar */}
                            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                                <div style={{
                                    width: '90px', height: '90px', borderRadius: '50%',
                                    background: `${accentColor}20`,
                                    border: `3px solid ${accentColor}50`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto',
                                    boxShadow: `0 0 28px ${accentColor}25`,
                                    transition: 'all 0.3s'
                                }}>
                                    <span style={{
                                        fontFamily: '"Syne", sans-serif', fontWeight: 800,
                                        fontSize: '32px', color: accentColor
                                    }}>
                                        {(isEditing ? editName : userData?.name)?.slice(0, 1)?.toUpperCase() || <FaUserAstronaut />}
                                    </span>
                                </div>
                                {!isEditing && (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsEditing(true)}
                                        style={{
                                            position: 'absolute', bottom: 0, right: 0,
                                            width: '28px', height: '28px', borderRadius: '50%',
                                            background: accentColor,
                                            border: '2px solid #06060a',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', color: '#06060a'
                                        }}
                                    >
                                        <FaEdit size={11} />
                                    </motion.button>
                                )}
                            </div>

                            {/* Name / Bio display */}
                            {!isEditing ? (
                                <>
                                    <h2 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '22px', color: '#fff', margin: '0 0 6px' }}>
                                        {userData?.name}
                                    </h2>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', margin: '0 0 10px' }}>
                                        {userData?.email}
                                    </p>
                                    <p style={{
                                        color: 'rgba(255,255,255,0.5)', fontFamily: '"DM Sans", sans-serif',
                                        fontSize: '13px', lineHeight: 1.6,
                                        margin: '0 0 16px',
                                        minHeight: '20px'
                                    }}>
                                        {userData?.bio || <span style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>No bio yet — click edit to add one</span>}
                                    </p>

                                    {/* Tags */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                                        <span style={{
                                            background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
                                            color: '#4ade80', fontSize: '11px', fontWeight: 600,
                                            padding: '4px 12px', borderRadius: '50px',
                                            fontFamily: '"DM Sans", sans-serif',
                                            display: 'flex', alignItems: 'center', gap: '5px'
                                        }}>
                                            <BsCoin size={11} /> {userData?.credits || 0} Credits
                                        </span>
                                        <span style={{
                                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                                            color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600,
                                            padding: '4px 12px', borderRadius: '50px',
                                            fontFamily: '"DM Sans", sans-serif',
                                            display: 'flex', alignItems: 'center', gap: '5px'
                                        }}>
                                            <BsCalendar3 size={11} /> Since {memberSince}
                                        </span>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                        onClick={() => setIsEditing(true)}
                                        style={{
                                            width: '100%', padding: '11px',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.09)',
                                            borderRadius: '12px', color: 'rgba(255,255,255,0.7)',
                                            fontFamily: '"DM Sans", sans-serif', fontWeight: 600,
                                            fontSize: '14px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', gap: '8px'
                                        }}
                                    >
                                        <FaEdit size={13} /> Edit Profile
                                    </motion.button>
                                </>
                            ) : (
                                /* ── EDIT FORM ── */
                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        style={{ textAlign: 'left' }}
                                    >
                                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Name</p>
                                        <input
                                            className='pp-input'
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            placeholder="Your name"
                                            style={{ marginBottom: '14px' }}
                                        />

                                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Bio</p>
                                        <textarea
                                            className='pp-textarea'
                                            value={editBio}
                                            onChange={e => setEditBio(e.target.value)}
                                            placeholder="Tell us about yourself..."
                                            style={{ marginBottom: '16px' }}
                                        />

                                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>Avatar Color</p>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                            {AVATAR_COLORS.map(color => (
                                                <div
                                                    key={color}
                                                    className='color-dot'
                                                    onClick={() => setEditColor(color)}
                                                    style={{
                                                        background: color,
                                                        borderColor: editColor === color ? '#fff' : 'transparent',
                                                        boxShadow: editColor === color ? `0 0 12px ${color}80` : 'none',
                                                        transform: editColor === color ? 'scale(1.2)' : 'scale(1)'
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <motion.button
                                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                onClick={handleSave}
                                                disabled={saving || !editName.trim()}
                                                style={{
                                                    flex: 1, padding: '11px',
                                                    background: editName.trim() ? `linear-gradient(135deg, ${editColor}, ${editColor}cc)` : 'rgba(255,255,255,0.05)',
                                                    border: 'none', borderRadius: '12px',
                                                    color: editName.trim() ? '#06060a' : 'rgba(255,255,255,0.2)',
                                                    fontFamily: '"DM Sans", sans-serif', fontWeight: 700,
                                                    fontSize: '14px', cursor: editName.trim() ? 'pointer' : 'not-allowed',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px'
                                                }}
                                            >
                                                {saving ? (
                                                    <span style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#06060a', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                                                ) : (
                                                    <><FaSave size={13} /> Save</>
                                                )}
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                onClick={handleCancel}
                                                style={{
                                                    padding: '11px 16px',
                                                    background: 'rgba(248,113,113,0.08)',
                                                    border: '1px solid rgba(248,113,113,0.2)',
                                                    borderRadius: '12px', color: '#f87171',
                                                    fontFamily: '"DM Sans", sans-serif', fontWeight: 600,
                                                    fontSize: '14px', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: '6px'
                                                }}
                                            >
                                                <FaTimes size={13} /> Cancel
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </motion.div>

                        {/* Quick actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className='pp-card'
                        >
                            <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '15px', color: '#fff', margin: '0 0 16px' }}>Quick Actions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {[
                                    { icon: <BsLightningChargeFill size={14} color="#4ade80" />, label: 'Start New Interview', action: () => navigate('/interview'), color: '#4ade80' },
                                    { icon: <BsBarChart size={14} color="#60a5fa" />, label: 'View History', action: () => navigate('/history'), color: '#60a5fa' },
                                    { icon: <BsCoin size={14} color="#fbbf24" />, label: 'Buy Credits', action: () => navigate('/pricing'), color: '#fbbf24' },
                                ].map((item, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ x: 4, borderColor: `${item.color}40` }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={item.action}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.07)',
                                            borderRadius: '12px', padding: '12px 14px',
                                            cursor: 'pointer', color: 'rgba(255,255,255,0.65)',
                                            fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: 500,
                                            transition: 'all 0.2s', textAlign: 'left'
                                        }}
                                    >
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '9px',
                                            background: `${item.color}12`, border: `1px solid ${item.color}25`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                        }}>
                                            {item.icon}
                                        </div>
                                        {item.label}
                                        <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)' }}>→</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* ── RIGHT: STATS + ACTIVITY ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', gridColumn: 'span 1' }}>

                        {/* Stats grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                        >
                            <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '15px', color: '#fff', margin: '0 0 14px' }}>Performance Overview</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {[
                                    { icon: <BsBriefcase size={16} color="#4ade80" />, label: 'Total Interviews', value: stats?.total ?? '—', color: '#4ade80' },
                                    { icon: <BsTrophy size={16} color="#fbbf24" />, label: 'Avg Score', value: stats ? `${stats.avgScore}/10` : '—', color: '#fbbf24' },
                                    { icon: <BsCheckCircleFill size={16} color="#60a5fa" />, label: 'Completed', value: stats?.completed ?? '—', color: '#60a5fa' },
                                    { icon: <BsBarChart size={16} color="#a78bfa" />, label: 'Best Score', value: stats ? `${stats.bestScore}/10` : '—', color: '#a78bfa' },
                                ].map((s, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 + i * 0.06 }}
                                        className='stat-card'
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
                                            <div style={{
                                                width: '30px', height: '30px', borderRadius: '9px',
                                                background: `${s.color}12`, border: `1px solid ${s.color}25`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {s.icon}
                                            </div>
                                        </div>
                                        <div style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '24px', color: '#fff', marginBottom: '4px' }}>
                                            {stats ? s.value : (
                                                <span style={{ width: '24px', height: '24px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: s.color, borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                                            )}
                                        </div>
                                        <div style={{ color: 'rgba(255,255,255,0.35)', fontFamily: '"DM Sans", sans-serif', fontSize: '12px' }}>{s.label}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Mode breakdown */}
                        {stats && (stats.techCount > 0 || stats.hrCount > 0) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className='pp-card'
                            >
                                <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '15px', color: '#fff', margin: '0 0 18px' }}>Interview Mode Split</h3>
                                {[
                                    { label: 'Technical', count: stats.techCount, color: '#4ade80' },
                                    { label: 'HR', count: stats.hrCount, color: '#60a5fa' },
                                ].map((m, i) => {
                                    const pct = stats.total > 0 ? Math.round((m.count / stats.total) * 100) : 0
                                    return (
                                        <div key={i} style={{ marginBottom: i === 0 ? '14px' : 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                                                <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: '"DM Sans", sans-serif', fontSize: '13px' }}>{m.label}</span>
                                                <span style={{ color: m.color, fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '13px' }}>{m.count} ({pct}%)</span>
                                            </div>
                                            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '50px', height: '6px', overflow: 'hidden' }}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                                                    style={{ height: '100%', borderRadius: '50px', background: m.color }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </motion.div>
                        )}

                        {/* Recent activity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                            className='pp-card'
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <h3 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '15px', color: '#fff', margin: 0 }}>Recent Activity</h3>
                                <motion.button
                                    whileHover={{ color: '#4ade80' }}
                                    onClick={() => navigate('/history')}
                                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontFamily: '"DM Sans", sans-serif', fontSize: '12px', cursor: 'pointer' }}
                                >
                                    View all →
                                </motion.button>
                            </div>

                            {!stats ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                                    <span style={{ width: '24px', height: '24px', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#4ade80', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                                </div>
                            ) : stats.recent.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '24px' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.25)', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', margin: 0 }}>No interviews yet</p>
                                </div>
                            ) : (
                                stats.recent.map((item, i) => {
                                    const scoreColor = item.score >= 8 ? '#4ade80' : item.score >= 5 ? '#fbbf24' : '#f87171'
                                    return (
                                        <div key={i} className='activity-row'>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ color: '#fff', fontFamily: '"DM Sans", sans-serif', fontSize: '14px', fontWeight: 600, margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {item.role}
                                                </p>
                                                <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: '"DM Sans", sans-serif', fontSize: '12px', margin: 0 }}>
                                                    {item.mode} • {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                            <div style={{
                                                background: `${scoreColor}15`,
                                                border: `1px solid ${scoreColor}30`,
                                                color: scoreColor,
                                                fontFamily: '"Syne", sans-serif', fontWeight: 800,
                                                fontSize: '13px', padding: '3px 10px',
                                                borderRadius: '50px', flexShrink: 0
                                            }}>
                                                {item.score}/10
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Success toast */}
            <AnimatePresence>
                {saveSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className='success-toast'
                    >
                        <BsCheckCircleFill size={16} color="#4ade80" />
                        <span style={{ color: '#fff', fontFamily: '"DM Sans", sans-serif', fontSize: '14px', fontWeight: 500 }}>
                            Profile updated successfully!
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Profile