import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { serverUrl } from '../App'
import axios from 'axios'
import { motion } from 'motion/react'
import { BsCalendar3, BsClockHistory, BsTrophy, BsSearch } from 'react-icons/bs'

function InterviewHistory() {
    const [interviews, setInterviews] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(
                    serverUrl + "/api/interview/get-interview",
                    { withCredentials: true }
                );
                setInterviews(result.data);
            } catch (error) {
                console.log(error);
            }
        };
        getMyInterviews();
    }, []);

    const filtered = interviews.filter(i =>
        i.role?.toLowerCase().includes(search.toLowerCase()) ||
        i.mode?.toLowerCase().includes(search.toLowerCase())
    );

    const avgScore = interviews.length
        ? (interviews.reduce((a, b) => a + (b.finalScore || 0), 0) / interviews.length).toFixed(1)
        : 0;

    const completed = interviews.filter(i => i.status === 'completed').length;

    const getScoreColor = (score) => {
        if (score >= 8) return '#4ade80';
        if (score >= 5) return '#fbbf24';
        return '#f87171';
    }

    const getScoreBg = (score) => {
        if (score >= 8) return 'rgba(74,222,128,0.1)';
        if (score >= 5) return 'rgba(251,191,36,0.1)';
        return 'rgba(248,113,113,0.1)';
    }

    return (
        <div style={{ minHeight: '100vh', background: '#06060a', padding: '32px 24px' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
                .ih-card {
                    background: rgba(255,255,255,0.035);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 20px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }
                .ih-card::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 3px;
                    background: linear-gradient(180deg, #4ade80, #22d3ee);
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .ih-card:hover::before { opacity: 1; }
                .ih-card:hover {
                    border-color: rgba(74,222,128,0.25);
                    background: rgba(74,222,128,0.04);
                    transform: translateX(4px);
                    box-shadow: 0 8px 40px rgba(0,0,0,0.3);
                }
                .stat-box {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 16px;
                    padding: 20px 24px;
                    flex: 1;
                    min-width: 140px;
                }
                .search-input {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    padding: 10px 16px 10px 40px;
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    outline: none;
                    width: 240px;
                    transition: border-color 0.2s;
                }
                .search-input::placeholder { color: rgba(255,255,255,0.25); }
                .search-input:focus { border-color: rgba(74,222,128,0.4); }
            `}</style>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
                    <motion.button
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
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
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '28px', color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
                            Interview History
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', margin: '4px 0 0' }}>
                            Track your past interviews and performance
                        </p>
                    </div>

                    {/* Search */}
                    <div style={{ position: 'relative' }}>
                        <BsSearch size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                        <input
                            className='search-input'
                            placeholder='Search role or mode...'
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Stats Row */}
                {interviews.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}
                    >
                        {[
                            { icon: <BsClockHistory size={18} color="#4ade80" />, label: 'Total Interviews', value: interviews.length },
                            { icon: <BsTrophy size={18} color="#fbbf24" />, label: 'Avg Score', value: `${avgScore}/10` },
                            { icon: <BsCalendar3 size={18} color="#60a5fa" />, label: 'Completed', value: completed },
                        ].map((s, i) => (
                            <div key={i} className='stat-box'>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    {s.icon}
                                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: '"DM Sans", sans-serif' }}>{s.label}</span>
                                </div>
                                <div style={{ color: '#fff', fontSize: '24px', fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>{s.value}</div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* Empty State */}
                {interviews.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: '24px',
                            padding: '80px 40px',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
                        <h3 style={{ color: '#fff', fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>
                            No interviews yet
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontFamily: '"DM Sans", sans-serif', fontSize: '14px', marginBottom: '24px' }}>
                            Start your first AI interview to see your history here.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/interview')}
                            style={{
                                background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                                color: '#06060a', border: 'none', borderRadius: '50px',
                                padding: '12px 28px', fontWeight: 700, fontSize: '14px',
                                cursor: 'pointer', fontFamily: '"DM Sans", sans-serif'
                            }}
                        >
                            Start First Interview →
                        </motion.button>
                    </motion.div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filtered.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.06 }}
                                className='ih-card'
                                onClick={() => navigate(`/report/${item._id}`)}
                                style={{ padding: '22px 28px' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                                        {/* Score ring */}
                                        <div style={{
                                            width: '52px', height: '52px', borderRadius: '50%',
                                            background: getScoreBg(item.finalScore || 0),
                                            border: `2px solid ${getScoreColor(item.finalScore || 0)}40`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <span style={{ color: getScoreColor(item.finalScore || 0), fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '13px' }}>
                                                {item.finalScore || 0}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 style={{ color: '#fff', fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '16px', margin: '0 0 4px' }}>
                                                {item.role}
                                            </h3>
                                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                                <span style={{
                                                    color: 'rgba(255,255,255,0.4)', fontSize: '12px',
                                                    fontFamily: '"DM Sans", sans-serif'
                                                }}>{item.experience}</span>
                                                <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
                                                <span style={{
                                                    background: 'rgba(74,222,128,0.08)',
                                                    border: '1px solid rgba(74,222,128,0.15)',
                                                    color: '#4ade80', fontSize: '11px',
                                                    fontFamily: '"DM Sans", sans-serif',
                                                    fontWeight: 600, padding: '1px 8px', borderRadius: '50px'
                                                }}>{item.mode}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontFamily: '"DM Sans", sans-serif', marginBottom: '2px' }}>
                                                {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 600,
                                                fontFamily: '"DM Sans", sans-serif',
                                                background: item.status === 'completed' ? 'rgba(74,222,128,0.1)' : 'rgba(251,191,36,0.1)',
                                                color: item.status === 'completed' ? '#4ade80' : '#fbbf24',
                                                border: `1px solid ${item.status === 'completed' ? 'rgba(74,222,128,0.2)' : 'rgba(251,191,36,0.2)'}`
                                            }}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '18px' }}>→</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default InterviewHistory