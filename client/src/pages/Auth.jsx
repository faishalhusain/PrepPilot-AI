import React from 'react'
import { GiTargetShot } from "react-icons/gi";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { BsShieldCheck, BsStars, BsLightningChargeFill } from 'react-icons/bs';
import { FaUserTie, FaMicrophoneAlt, FaChartLine } from 'react-icons/fa';
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from '../utils/firebase';
import { serverUrl } from '../App';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Auth({ isModel = false }) {
    const dispatch = useDispatch();

    const handleGoogleAuth = async () => {
        try {
            const response = await signInWithPopup(auth, provider);
            let User = response.user;
            let name = User.displayName;
            let email = User.email;
            const result = await axios.post(
                serverUrl + "/api/auth/google",
                { name, email },
                { withCredentials: true }
            );
            dispatch(setUserData(result.data));
        } catch (error) {
            console.error(error);
            dispatch(setUserData(null));
        }
    };

    /* ── MODAL variant ───────────────────────────────────── */
    if (isModel) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                    background: 'rgba(12,12,18,0.97)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: '28px',
                    padding: '40px 36px',
                    width: '100%',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* top glow */}
                <div style={{
                    position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.5), transparent)'
                }} />
                {/* bg orb */}
                <div style={{
                    position: 'absolute', top: '-60px', right: '-60px',
                    width: '200px', height: '200px', borderRadius: '50%',
                    background: '#4ade80', filter: 'blur(80px)', opacity: 0.07, pointerEvents: 'none'
                }} />

                <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                        padding: '8px', borderRadius: '10px',
                        boxShadow: '0 0 16px rgba(74,222,128,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <GiTargetShot size={18} color="#06060a" />
                    </div>
                    <span style={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '17px', color: '#fff' }}>
                        PrepPilot<span style={{ color: '#4ade80' }}>-AI</span>
                    </span>
                </div>

                {/* Heading */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <h1 style={{
                        fontFamily: '"Syne", sans-serif', fontWeight: 800,
                        fontSize: '22px', color: '#fff', lineHeight: 1.2,
                        margin: '0 0 10px', letterSpacing: '-0.3px'
                    }}>
                        Sign in to continue
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.4)', fontFamily: '"DM Sans", sans-serif',
                        fontSize: '14px', lineHeight: 1.6, margin: 0
                    }}>
                        Start your AI-powered interview preparation journey today.
                    </p>
                </div>

                {/* Feature pills */}
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                    {[
                        { icon: <BsLightningChargeFill size={10} />, text: 'AI Feedback' },
                        { icon: <BsShieldCheck size={10} />, text: 'Secure' },
                        { icon: <BsStars size={10} />, text: 'Free to start' },
                    ].map((p, i) => (
                        <span key={i} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            background: 'rgba(74,222,128,0.08)',
                            border: '1px solid rgba(74,222,128,0.18)',
                            color: '#4ade80', fontSize: '11px', fontWeight: 600,
                            padding: '4px 12px', borderRadius: '50px',
                            fontFamily: '"DM Sans", sans-serif'
                        }}>
                            {p.icon} {p.text}
                        </span>
                    ))}
                </div>

                {/* Google Button */}
                <motion.button
                    onClick={handleGoogleAuth}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(74,222,128,0.25)' }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                        width: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        padding: '14px',
                        background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                        color: '#06060a', border: 'none', borderRadius: '14px',
                        fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '15px',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(74,222,128,0.2)',
                        transition: 'all 0.2s',
                        marginBottom: '14px'
                    }}
                >
                    <FcGoogle size={20} />
                    Continue with Google
                </motion.button>

                <p style={{
                    textAlign: 'center', color: 'rgba(255,255,255,0.2)',
                    fontSize: '12px', fontFamily: '"DM Sans", sans-serif', margin: 0
                }}>
                    🔒 We never store your passwords
                </p>
            </motion.div>
        )
    }

    /* ── FULL PAGE variant ───────────────────────────────── */
    return (
        <div style={{ minHeight: '100vh', background: '#06060a', display: 'flex', overflow: 'hidden' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
                .auth-feature-card {
                    display: flex; align-items: center; gap: 14px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 14px; padding: 14px 16px;
                    transition: all 0.25s;
                }
                .auth-feature-card:hover {
                    background: rgba(74,222,128,0.06);
                    border-color: rgba(74,222,128,0.2);
                }
                .google-btn {
                    width: 100%;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    padding: 15px;
                    background: linear-gradient(135deg, #4ade80, #22c55e);
                    color: #06060a; border: none; border-radius: 14px;
                    font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 16px;
                    cursor: pointer;
                    box-shadow: 0 0 24px rgba(74,222,128,0.3);
                    transition: box-shadow 0.2s, transform 0.15s;
                }
                .google-btn:hover {
                    box-shadow: 0 0 40px rgba(74,222,128,0.5);
                    transform: scale(1.02);
                }
                .google-btn:active { transform: scale(0.97); }

                .stat-chip {
                    display: flex; flex-direction: column; align-items: center;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 14px; padding: 14px 20px; flex: 1; min-width: 90px;
                }
            `}</style>

            {/* ── LEFT PANEL (decorative) ── */}
            <div style={{
                flex: 1, display: 'none',
                background: 'linear-gradient(160deg, rgba(74,222,128,0.07) 0%, rgba(34,211,238,0.04) 100%)',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                padding: '60px 48px',
                flexDirection: 'column', justifyContent: 'center',
                position: 'relative', overflow: 'hidden'
            }}
                className='auth-left-panel'
            >
                {/* Orbs */}
                <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: '#4ade80', filter: 'blur(100px)', opacity: 0.08 }} />
                <div style={{ position: 'absolute', bottom: '-100px', right: '-50px', width: '300px', height: '300px', borderRadius: '50%', background: '#22d3ee', filter: 'blur(80px)', opacity: 0.06 }} />

                {/* Grid bg */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                    backgroundSize: '48px 48px'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
                        color: '#4ade80', fontSize: '11px', fontWeight: 700,
                        padding: '5px 14px', borderRadius: '50px',
                        fontFamily: '"DM Sans", sans-serif', marginBottom: '24px',
                        letterSpacing: '0.08em', textTransform: 'uppercase'
                    }}>
                        <BsLightningChargeFill size={10} /> AI-Powered Platform
                    </div>

                    <h2 style={{
                        fontFamily: '"Syne", sans-serif', fontWeight: 800,
                        fontSize: 'clamp(32px, 3vw, 48px)', color: '#fff',
                        lineHeight: 1.12, margin: '0 0 16px', letterSpacing: '-1px'
                    }}>
                        Ace Every<br />
                        <span style={{ background: 'linear-gradient(135deg, #4ade80, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Interview
                        </span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: '"DM Sans", sans-serif', fontSize: '15px', lineHeight: 1.7, margin: '0 0 40px', maxWidth: '340px' }}>
                        Practice with AI, get instant feedback, and walk into your next interview with confidence.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                        {[
                            { icon: <FaUserTie size={16} color="#4ade80" />, title: 'Role-Based Questions', desc: 'Tailored to your target job' },
                            { icon: <FaMicrophoneAlt size={16} color="#60a5fa" />, title: 'Voice Interview', desc: 'Real-time speech recognition' },
                            { icon: <FaChartLine size={16} color="#a78bfa" />, title: 'Performance Analytics', desc: 'Track your improvement over time' },
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + i * 0.12 }}
                                className='auth-feature-card'
                            >
                                <div style={{
                                    width: '38px', height: '38px', borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>{f.icon}</div>
                                <div>
                                    <p style={{ color: '#fff', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '14px', margin: '0 0 2px' }}>{f.title}</p>
                                    <p style={{ color: 'rgba(255,255,255,0.35)', fontFamily: '"DM Sans", sans-serif', fontSize: '12px', margin: 0 }}>{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {[
                            { val: '10K+', label: 'Interviews' },
                            { val: '98%', label: 'Satisfaction' },
                            { val: 'Free', label: 'To Start' },
                        ].map((s, i) => (
                            <div key={i} className='stat-chip'>
                                <span style={{ color: '#4ade80', fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '18px' }}>{s.val}</span>
                                <span style={{ color: 'rgba(255,255,255,0.3)', fontFamily: '"DM Sans", sans-serif', fontSize: '11px', marginTop: '2px' }}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL (auth form) ── */}
            <div style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '40px 24px', position: 'relative', minHeight: '100vh'
            }}>
                {/* Background orbs */}
                <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '400px', borderRadius: '50%', background: '#4ade80', filter: 'blur(120px)', opacity: 0.06, pointerEvents: 'none' }} />

                {/* Grid */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
                    backgroundSize: '48px 48px', pointerEvents: 'none'
                }} />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    style={{
                        width: '100%', maxWidth: '420px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '28px',
                        padding: '44px 40px',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 40px 80px rgba(0,0,0,0.5)'
                    }}
                >
                    {/* Top glow line */}
                    <div style={{
                        position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.5), transparent)'
                    }} />

                    {/* Inner orb */}
                    <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: '#4ade80', filter: 'blur(80px)', opacity: 0.06, pointerEvents: 'none' }} />

                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '32px' }}
                    >
                        <div style={{
                            background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                            padding: '10px', borderRadius: '12px',
                            boxShadow: '0 0 20px rgba(74,222,128,0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <GiTargetShot size={20} color="#06060a" />
                        </div>
                        <span style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '20px', color: '#fff', letterSpacing: '-0.3px' }}>
                            PrepPilot<span style={{ color: '#4ade80' }}>-AI</span>
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.18 }}
                        style={{ textAlign: 'center', marginBottom: '32px' }}
                    >
                        <h1 style={{
                            fontFamily: '"Syne", sans-serif', fontWeight: 800,
                            fontSize: '26px', color: '#fff', margin: '0 0 10px',
                            letterSpacing: '-0.4px', lineHeight: 1.2
                        }}>
                            Welcome Back 👋
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: '"DM Sans", sans-serif', fontSize: '14px', lineHeight: 1.65, margin: 0 }}>
                            Sign in to start your smart AI interview preparation journey.
                        </p>
                    </motion.div>

                    {/* Feature chips */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}
                    >
                        {[
                            { icon: <BsLightningChargeFill size={10} />, text: 'AI Interview' },
                            { icon: <BsShieldCheck size={10} />, text: 'Secure Login' },
                            { icon: <BsStars size={10} />, text: 'Free Credits' },
                        ].map((p, i) => (
                            <span key={i} style={{
                                display: 'inline-flex', alignItems: 'center', gap: '5px',
                                background: 'rgba(74,222,128,0.08)',
                                border: '1px solid rgba(74,222,128,0.18)',
                                color: '#4ade80', fontSize: '11px', fontWeight: 600,
                                padding: '4px 12px', borderRadius: '50px',
                                fontFamily: '"DM Sans", sans-serif'
                            }}>
                                {p.icon} {p.text}
                            </span>
                        ))}
                    </motion.div>

                    {/* Divider */}
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '28px' }} />

                    {/* Google button */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.32 }}
                    >
                        <button className='google-btn' onClick={handleGoogleAuth}>
                            <FcGoogle size={22} />
                            Continue with Google
                        </button>
                    </motion.div>

                    {/* Trust note */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{
                            textAlign: 'center', color: 'rgba(255,255,255,0.2)',
                            fontSize: '12px', fontFamily: '"DM Sans", sans-serif',
                            margin: '18px 0 0'
                        }}
                    >
                        🔒 Secured by Google OAuth · No passwords stored
                    </motion.p>
                </motion.div>
            </div>

            {/* Show left panel only on larger screens via inline media query trick */}
            <style>{`
                @media (min-width: 900px) {
                    .auth-left-panel { display: flex !important; }
                }
            `}</style>
        </div>
    )
}

export default Auth;