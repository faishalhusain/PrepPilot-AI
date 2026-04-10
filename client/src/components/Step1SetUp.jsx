import React, { useState } from 'react'
import { motion } from "motion/react"
import { FaUserTie, FaBriefcase, FaFileUpload, FaMicrophoneAlt, FaChartLine, FaArrowLeft } from "react-icons/fa";
import { BsArrowRight, BsCheckCircleFill, BsLightningChargeFill } from 'react-icons/bs';
import axios from "axios"
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function Step1SetUp({ onStart }) {
    const { userData } = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [mode, setMode] = useState("Technical");
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeText, setResumeText] = useState("");
    const [analysisDone, setAnalysisDone] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const navigate = useNavigate()

    const handleUploadResume = async () => {
        if (!resumeFile) return;
        setAnalyzing(true)
        const formdata = new FormData()
        formdata.append("resume", resumeFile)
        try {
            const result = await axios.post(serverUrl + "/api/interview/resume", formdata, { withCredentials: true })
            setRole(result.data.role || "");
            setExperience(result.data.experience || "");
            setProjects(result.data.projects || []);
            setSkills(result.data.skills || []);
            setResumeText(result.data.resumeText || "");
            setAnalysisDone(true);
        } catch (error) {
            console.log(error)
        } finally {
            setAnalyzing(false)
        }
    }

    const handleStart = async () => {
        setLoading(true)
        try {
            const result = await axios.post(serverUrl + "/api/interview/generate-questions", { role, experience, mode, resumeText, projects, skills }, { withCredentials: true })
            if (userData) {
                dispatch(setUserData({ ...userData, credits: result.data.creditsLeft }))
            }
            setLoading(false)
            onStart(result.data)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#06060a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
            {/* Back Button */}
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                style={{
                    position: 'fixed',
                    top: '24px',
                    left: '24px',
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 50,
                }}
            >
                <FaArrowLeft size={14} />
            </motion.button>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
                .s1-input {
                    width: 100%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 14px;
                    padding: 14px 16px 14px 44px;
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 15px;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s;
                    box-sizing: border-box;
                }
                .s1-input:focus {
                    border-color: rgba(74,222,128,0.45);
                    background: rgba(74,222,128,0.04);
                }
                .s1-input::placeholder { color: rgba(255,255,255,0.25); }
                .s1-select {
                    width: 100%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 14px;
                    padding: 14px 16px;
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 15px;
                    outline: none;
                    transition: border-color 0.2s;
                    cursor: pointer;
                    appearance: none;
                }
                .s1-select:focus { border-color: rgba(74,222,128,0.45); }
                .s1-select option { background: #111; color: #fff; }
                .feature-pill {
                    display: flex; align-items: center; gap: 12px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 14px;
                    padding: 14px 16px;
                    transition: border-color 0.2s, background 0.2s;
                }
                .feature-pill:hover {
                    background: rgba(74,222,128,0.05);
                    border-color: rgba(74,222,128,0.2);
                }
                .skill-tag {
                    background: rgba(74,222,128,0.1);
                    border: 1px solid rgba(74,222,128,0.2);
                    color: #4ade80;
                    padding: 4px 12px;
                    border-radius: 50px;
                    font-size: 12px;
                    font-family: 'DM Sans', sans-serif;
                    font-weight: 600;
                }
            `}</style>

            <div style={{
                width: '100%', maxWidth: '1000px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '32px',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                boxShadow: '0 40px 120px rgba(0,0,0,0.6)'
            }}>

                {/* LEFT PANEL */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{
                        background: 'linear-gradient(160deg, rgba(74,222,128,0.08) 0%, rgba(34,211,238,0.04) 100%)',
                        borderRight: '1px solid rgba(255,255,255,0.06)',
                        padding: '48px 40px',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        position: 'relative', overflow: 'hidden'
                    }}
                >
                    {/* Glow */}
                    <div style={{
                        position: 'absolute', top: '-80px', left: '-80px',
                        width: '300px', height: '300px', borderRadius: '50%',
                        background: '#4ade80', filter: 'blur(80px)', opacity: 0.07
                    }} />

                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
                        color: '#4ade80', fontSize: '11px', fontWeight: 700,
                        padding: '5px 12px', borderRadius: '50px',
                        fontFamily: '"DM Sans", sans-serif', marginBottom: '20px',
                        letterSpacing: '0.05em', textTransform: 'uppercase'
                    }}>
                        <BsLightningChargeFill size={10} /> AI Powered
                    </div>

                    <h2 style={{
                        fontFamily: '"Syne", sans-serif', fontWeight: 800,
                        fontSize: '32px', color: '#fff', lineHeight: 1.2,
                        margin: '0 0 14px', letterSpacing: '-0.5px'
                    }}>
                        Start Your<br />
                        <span style={{ color: '#4ade80' }}>AI Interview</span>
                    </h2>
                    <p style={{
                        color: 'rgba(255,255,255,0.4)', fontFamily: '"DM Sans", sans-serif',
                        fontSize: '14px', lineHeight: 1.7, margin: '0 0 36px'
                    }}>
                        Practice real interview scenarios powered by AI. Improve communication, technical skills, and confidence.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { icon: <FaUserTie size={16} color="#4ade80" />, text: "Choose Role & Experience" },
                            { icon: <FaMicrophoneAlt size={16} color="#4ade80" />, text: "Smart Voice Interview" },
                            { icon: <FaChartLine size={16} color="#4ade80" />, text: "Performance Analytics" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.12 }}
                                className='feature-pill'
                            >
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                }}>
                                    {item.icon}
                                </div>
                                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontFamily: '"DM Sans", sans-serif', fontWeight: 500 }}>
                                    {item.text}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Credits indicator */}
                    <div style={{
                        marginTop: '32px', padding: '14px 16px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                        <span style={{ fontSize: '20px' }}>💰</span>
                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontFamily: '"DM Sans", sans-serif', margin: 0 }}>Available Credits</p>
                            <p style={{ color: '#4ade80', fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '18px', margin: 0 }}>
                                {userData?.credits || 0}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT PANEL */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ padding: '48px 40px', background: 'rgba(255,255,255,0.01)' }}
                >
                    <h2 style={{
                        fontFamily: '"Syne", sans-serif', fontWeight: 700,
                        fontSize: '24px', color: '#fff', margin: '0 0 28px'
                    }}>Interview Setup</h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* Role */}
                        <div style={{ position: 'relative' }}>
                            <FaUserTie style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', fontSize: '14px' }} />
                            <input
                                type='text'
                                placeholder='Enter target role (e.g. Frontend Developer)'
                                className='s1-input'
                                onChange={(e) => setRole(e.target.value)}
                                value={role}
                            />
                        </div>

                        {/* Experience */}
                        <div style={{ position: 'relative' }}>
                            <FaBriefcase style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', fontSize: '14px' }} />
                            <input
                                type='text'
                                placeholder='Experience (e.g. 2 years / Fresher)'
                                className='s1-input'
                                onChange={(e) => setExperience(e.target.value)}
                                value={experience}
                            />
                        </div>

                        {/* Mode */}
                        <div style={{ position: 'relative' }}>
                            <select
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                                className='s1-select'
                            >
                                <option value="Technical">⚙️ Technical Interview</option>
                                <option value="HR">🤝 HR Interview</option>
                            </select>
                            <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(255,255,255,0.3)' }}>▾</div>
                        </div>

                        {/* Resume Upload */}
                        {!analysisDone && (
                            <motion.div
                                whileHover={{ borderColor: 'rgba(74,222,128,0.4)' }}
                                onClick={() => { if (!resumeFile) document.getElementById("resumeUpload").click() }}
                                style={{
                                    border: '2px dashed rgba(255,255,255,0.1)',
                                    borderRadius: '16px', padding: '28px',
                                    textAlign: 'center', cursor: 'pointer',
                                    transition: 'border-color 0.2s, background 0.2s',
                                    background: 'rgba(255,255,255,0.02)'
                                }}
                            >
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '14px',
                                    background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 12px'
                                }}>
                                    <FaFileUpload size={20} color="#4ade80" />
                                </div>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: '"DM Sans", sans-serif', fontSize: '14px', margin: '0 0 4px', fontWeight: 500 }}>
                                    {resumeFile ? resumeFile.name : "Upload Resume (optional)"}
                                </p>
                                <p style={{ color: 'rgba(255,255,255,0.25)', fontFamily: '"DM Sans", sans-serif', fontSize: '12px', margin: 0 }}>
                                    PDF format • Auto-fills role & skills
                                </p>
                                <input type="file" accept="application/pdf" id="resumeUpload" style={{ display: 'none' }} onChange={(e) => setResumeFile(e.target.files[0])} />
                                {resumeFile && (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        onClick={(e) => { e.stopPropagation(); handleUploadResume() }}
                                        style={{
                                            marginTop: '14px',
                                            background: 'rgba(74,222,128,0.1)',
                                            border: '1px solid rgba(74,222,128,0.3)',
                                            color: '#4ade80', padding: '8px 20px',
                                            borderRadius: '10px', fontWeight: 600,
                                            fontSize: '13px', cursor: 'pointer',
                                            fontFamily: '"DM Sans", sans-serif'
                                        }}
                                    >
                                        {analyzing ? "Analyzing..." : "Analyze Resume ✨"}
                                    </motion.button>
                                )}
                            </motion.div>
                        )}

                        {/* Analysis Result */}
                        {analysisDone && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    background: 'rgba(74,222,128,0.05)',
                                    border: '1px solid rgba(74,222,128,0.2)',
                                    borderRadius: '16px', padding: '20px'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                                    <BsCheckCircleFill size={16} color="#4ade80" />
                                    <h3 style={{ color: '#fff', fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '15px', margin: 0 }}>
                                        Resume Analyzed
                                    </h3>
                                </div>
                                {projects.length > 0 && (
                                    <div style={{ marginBottom: '12px' }}>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>Projects</p>
                                        <ul style={{ paddingLeft: '16px', margin: 0 }}>
                                            {projects.map((p, i) => (
                                                <li key={i} style={{ color: 'rgba(255,255,255,0.6)', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', marginBottom: '4px' }}>{p}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {skills.length > 0 && (
                                    <div>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>Skills</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {skills.map((s, i) => (
                                                <span key={i} className='skill-tag'>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Start Button */}
                        <motion.button
                            onClick={handleStart}
                            disabled={!role || !experience || loading}
                            whileHover={role && experience && !loading ? { scale: 1.02 } : {}}
                            whileTap={role && experience && !loading ? { scale: 0.97 } : {}}
                            style={{
                                width: '100%',
                                background: role && experience && !loading
                                    ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                                    : 'rgba(255,255,255,0.06)',
                                color: role && experience && !loading ? '#06060a' : 'rgba(255,255,255,0.3)',
                                border: 'none', borderRadius: '14px',
                                padding: '15px', fontWeight: 700, fontSize: '15px',
                                cursor: role && experience && !loading ? 'pointer' : 'not-allowed',
                                fontFamily: '"DM Sans", sans-serif',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                boxShadow: role && experience && !loading ? '0 0 24px rgba(74,222,128,0.3)' : 'none',
                                transition: 'all 0.25s',
                                marginTop: '4px'
                            }}
                        >
                            {loading ? "Starting Interview..." : <><span>Start Interview</span> <BsArrowRight size={16} /></>}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Step1SetUp