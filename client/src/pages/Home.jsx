import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { BsRobot, BsMic, BsClock, BsBarChart, BsFileEarmarkText, BsArrowRight, BsStars } from 'react-icons/bs'
import { LuSparkle } from "react-icons/lu";
import { motion } from "framer-motion";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthModel from '../components/AuthModel';
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from '../components/Footer';

/* ─── tiny helpers ─────────────────────────────────────────── */
const GlowOrb = ({ color, size, top, left, right, bottom, opacity = 0.18 }) => (
  <div style={{
    position: 'absolute', width: size, height: size, borderRadius: '50%',
    background: color, filter: 'blur(80px)', opacity,
    top, left, right, bottom, pointerEvents: 'none', zIndex: 0
  }} />
)

const Tag = ({ children }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'rgba(74,222,128,0.08)',
    border: '1px solid rgba(74,222,128,0.22)',
    color: '#4ade80', fontSize: '12px', fontWeight: 600,
    padding: '5px 14px', borderRadius: '50px',
    fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.04em'
  }}>{children}</span>
)

/* ─── main component ────────────────────────────────────────── */
const Home = () => {
  const { userData } = useSelector((state) => state.user)
  const [showAuth, setShowAuth] = useState(false)
  const navigate = useNavigate()

  const requireAuth = (path) => {
    if (!userData) { setShowAuth(true); return; }
    navigate(path)
  }

  return (
    <div style={{ background: '#06060a', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .pp-h1 { font-family: 'Syne', sans-serif; font-weight: 800; }
        .pp-body { font-family: 'DM Sans', sans-serif; }

        .pp-btn-primary {
          background: linear-gradient(135deg, #4ade80, #22c55e);
          color: #06060a;
          border: none;
          border-radius: 50px;
          padding: 14px 32px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 0 24px rgba(74,222,128,0.35);
          transition: box-shadow 0.2s, transform 0.15s;
        }
        .pp-btn-primary:hover { box-shadow: 0 0 40px rgba(74,222,128,0.55); }

        .pp-btn-secondary {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.75);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          padding: 14px 32px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s, border-color 0.2s;
        }
        .pp-btn-secondary:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
        }

        .pp-card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .pp-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(74,222,128,0.04), transparent);
          opacity: 0;
          transition: opacity 0.3s;
          border-radius: 24px;
        }
        .pp-card:hover::before { opacity: 1; }
        .pp-card:hover {
          border-color: rgba(74,222,128,0.2);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(74,222,128,0.08);
          transform: translateY(-4px);
        }

        .pp-step-card {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 40px 28px 32px;
          text-align: center;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .pp-step-card:hover {
          border-color: rgba(74,222,128,0.3);
          box-shadow: 0 0 40px rgba(74,222,128,0.08);
          transform: translateY(-6px) rotate(0deg) !important;
        }

        .pp-icon-box {
          background: rgba(74,222,128,0.1);
          border: 1px solid rgba(74,222,128,0.2);
          border-radius: 14px;
          width: 52px; height: 52px;
          display: flex; align-items: center; justify-content: center;
          color: #4ade80;
        }

        .stat-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50px;
          padding: 8px 18px;
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
        }
        .stat-pill span { color: #4ade80; font-weight: 700; }

        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #4ade80;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .section-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          color: #fff;
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.15;
          margin: 0;
        }

        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>

      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ position: 'relative', padding: '100px 24px 120px', textAlign: 'center' }} className='grid-bg'>
        <GlowOrb color="#4ade80" size="600px" top="-200px" left="50%" opacity={0.12} />
        <GlowOrb color="#3b82f6" size="400px" top="100px" left="-100px" opacity={0.08} />
        <GlowOrb color="#a855f7" size="400px" top="50px" right="-100px" opacity={0.07} />

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Tag><LuSparkle size={12} /> AI Powered Smart Interview Platform</Tag>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='pp-h1'
            style={{
              fontSize: 'clamp(40px, 7vw, 80px)',
              color: '#fff',
              lineHeight: 1.08,
              margin: '28px 0 24px',
              letterSpacing: '-2px'
            }}
          >
            Practice Smarter,<br />
            <span style={{
              background: 'linear-gradient(135deg, #4ade80 30%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Interview Better</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className='pp-body'
            style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 40px' }}
          >
            Ace your interviews with PrepPilot-AI. Get personalized AI feedback and build the skills needed to land your dream job.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '14px', marginBottom: '56px' }}
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className='pp-btn-primary'
              onClick={() => requireAuth('/interview')}
            >
              Start Interview <BsArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className='pp-btn-secondary'
              onClick={() => requireAuth('/history')}
            >
              View History
            </motion.button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}
          >
            {[['10K+', 'Interviews Done'], ['98%', 'Satisfaction Rate'], ['5+', 'Interview Modes'], ['AI', 'Powered Feedback']].map(([val, label]) => (
              <div key={label} className='stat-pill'><span>{val}</span> {label}</div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', position: 'relative' }}>
        <GlowOrb color="#4ade80" size="500px" top="0" left="50%" opacity={0.06} />
        <div style={{ maxWidth: '1152px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p className='section-label'>How It Works</p>
            <h2 className='section-title'>Three steps to <span style={{ color: '#4ade80' }}>interview mastery</span></h2>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px' }}>
            {[
              { icon: <BsRobot size={26} />, step: '01', title: 'Role & Experience', desc: 'AI adjusts difficulty based on your selected role and experience level.' },
              { icon: <BsMic size={26} />, step: '02', title: 'Smart Voice Interview', desc: 'Dynamic follow-up questions generated in real-time based on your answers.' },
              { icon: <BsClock size={26} />, step: '03', title: 'Timed Simulation', desc: 'Real interview pressure with accurate time tracking and countdowns.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.15 }}
                className='pp-step-card'
                style={{
                  width: '300px', maxWidth: '90vw',
                  rotate: i === 0 ? '-3deg' : i === 1 ? '2deg' : '-2deg'
                }}
              >
                {/* Step number watermark */}
                <div style={{
                  position: 'absolute', top: '16px', right: '20px',
                  fontSize: '52px', fontFamily: '"Syne", sans-serif', fontWeight: 800,
                  color: 'rgba(74,222,128,0.06)', lineHeight: 1
                }}>{item.step}</div>

                <div style={{
                  width: '64px', height: '64px', borderRadius: '18px',
                  background: 'rgba(74,222,128,0.1)',
                  border: '1px solid rgba(74,222,128,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#4ade80', margin: '0 auto 20px',
                  boxShadow: '0 0 20px rgba(74,222,128,0.15)'
                }}>
                  {item.icon}
                </div>

                <p style={{ color: '#4ade80', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', fontFamily: '"DM Sans", sans-serif' }}>
                  Step {item.step}
                </p>
                <h3 style={{ color: '#fff', fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', lineHeight: 1.7, fontFamily: '"DM Sans", sans-serif' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI CAPABILITIES ─────────────────────────────────── */}
      <section style={{ padding: '100px 24px', position: 'relative', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p className='section-label'>Capabilities</p>
            <h2 className='section-title'>Advanced AI <span style={{ color: '#4ade80' }}>Features</span></h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '20px' }}>
            {[
              { image: evalImg, icon: <BsBarChart size={20} />, title: 'AI Answer Evaluation', desc: 'Scores communication, technical accuracy, and confidence in real-time.' },
              { image: resumeImg, icon: <BsFileEarmarkText size={20} />, title: 'Resume-Based Interview', desc: 'Project-specific questions tailored directly from your uploaded resume.' },
              { image: pdfImg, icon: <BsFileEarmarkText size={20} />, title: 'Downloadable PDF Report', desc: 'Detailed strengths, weaknesses, and personalized improvement insights.' },
              { image: analyticsImg, icon: <BsBarChart size={20} />, title: 'History & Analytics', desc: 'Track your progress with performance graphs and topic-level analysis.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className='pp-card'
                style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}
              >
                <div style={{
                  width: '120px', flexShrink: 0,
                  background: 'rgba(74,222,128,0.05)',
                  border: '1px solid rgba(74,222,128,0.1)',
                  borderRadius: '16px', padding: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <img src={item.image} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div className='pp-icon-box' style={{ marginBottom: '14px' }}>{item.icon}</div>
                  <h3 style={{ color: '#fff', fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: 1.7, fontFamily: '"DM Sans", sans-serif' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERVIEW MODES ─────────────────────────────────── */}
      <section style={{ padding: '100px 24px', position: 'relative' }}>
        <GlowOrb color="#3b82f6" size="500px" bottom="-100px" left="0" opacity={0.07} />
        <div style={{ maxWidth: '1152px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <p className='section-label'>Modes</p>
            <h2 className='section-title'>Multiple Interview <span style={{ color: '#4ade80' }}>Modes</span></h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px' }}>
            {[
              { img: hrImg, title: 'HR Interview Mode', desc: 'Behavioral and communication-based evaluation for people-focused roles.', badge: 'Popular' },
              { img: techImg, title: 'Technical Mode', desc: 'Deep technical questioning based on your selected role and stack.', badge: 'Advanced' },
              { img: confidenceImg, title: 'Confidence Detection', desc: 'Basic tone and voice analysis for presentation and delivery insights.', badge: 'Unique' },
              { img: creditImg, title: 'Credits System', desc: 'Flexible credit-based access to unlock premium interview sessions.', badge: 'Flexible' },
            ].map((mode, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className='pp-card'
                style={{ padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}
              >
                <div style={{ flex: 1 }}>
                  <span style={{
                    display: 'inline-block',
                    background: 'rgba(74,222,128,0.1)',
                    border: '1px solid rgba(74,222,128,0.2)',
                    color: '#4ade80', fontSize: '11px', fontWeight: 700,
                    padding: '3px 10px', borderRadius: '50px',
                    fontFamily: '"DM Sans", sans-serif',
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    marginBottom: '12px'
                  }}>{mode.badge}</span>
                  <h3 style={{ color: '#fff', fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>{mode.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', lineHeight: 1.7, fontFamily: '"DM Sans", sans-serif' }}>{mode.desc}</p>
                </div>
                <div style={{
                  background: 'rgba(74,222,128,0.04)',
                  border: '1px solid rgba(74,222,128,0.1)',
                  borderRadius: '16px', padding: '12px', flexShrink: 0
                }}>
                  <img src={mode.img} alt={mode.title} style={{ width: '90px', height: '90px', objectFit: 'contain' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────── */}
      <section style={{ padding: '80px 24px 100px' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'linear-gradient(135deg, rgba(74,222,128,0.1) 0%, rgba(34,211,238,0.06) 100%)',
              border: '1px solid rgba(74,222,128,0.2)',
              borderRadius: '32px',
              padding: '64px 48px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <GlowOrb color="#4ade80" size="400px" top="-100px" left="50%" opacity={0.12} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <BsStars size={32} color="#4ade80" style={{ marginBottom: '16px' }} />
              <h2 className='section-title' style={{ marginBottom: '16px', fontSize: 'clamp(28px, 4vw, 48px)' }}>
                Ready to land your <span style={{ color: '#4ade80' }}>dream job?</span>
              </h2>
              <p className='pp-body' style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.7 }}>
                Start practicing with AI-powered mock interviews today and walk into your next interview with confidence.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className='pp-btn-primary'
                onClick={() => requireAuth('/interview')}
                style={{ fontSize: '16px', padding: '16px 40px' }}
              >
                Start Interview Now <BsArrowRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {showAuth ? <AuthModel onClose={() => setShowAuth(false)} /> : null}
      <Footer />
    </div>
  )
}

export default Home