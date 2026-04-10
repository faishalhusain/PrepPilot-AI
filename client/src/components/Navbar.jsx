import React, { useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux'
import { GiTargetShot } from "react-icons/gi";
import { BsCoin, BsPerson } from "react-icons/bs";
import { FaUserAstronaut } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbLogout2 } from "react-icons/tb";
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import axios from 'axios';
import AuthModel from './AuthModel';

const Navbar = () => {
  const { userData } = useSelector((state) => state.user)
  const [showCreditPopup, setShowCreditPopup] = useState(false)
  const [showUserPopup, setShowUserPopup] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Close popups on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setShowCreditPopup(false)
      setShowUserPopup(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true });
      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const accentColor = userData?.avatarColor || '#4ade80'

  return (
    <div className='flex justify-center px-4 pt-6 relative z-50'>
      <motion.nav
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className='w-full max-w-6xl'
        style={{
          background: 'rgba(10, 10, 15, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '14px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
          position: 'relative',
        }}
      >
        {/* Top glow line */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.4), transparent)',
          borderRadius: '50%'
        }} />

        {/* Logo */}
        <motion.div
          className='flex items-center gap-3 cursor-pointer'
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/')}
        >
          <div style={{
            background: 'linear-gradient(135deg, #4ade80, #22c55e)',
            padding: '8px', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(74,222,128,0.35)'
          }}>
            <GiTargetShot size={18} color="#0a0a0f" />
          </div>
          <span style={{
            fontFamily: '"Syne", sans-serif',
            fontWeight: 700, fontSize: '17px', color: '#fff', letterSpacing: '-0.3px'
          }} className='hidden md:block'>
            PrepPilot<span style={{ color: '#4ade80' }}>-AI</span>
          </span>
        </motion.div>

        {/* Nav links */}
        <div className='hidden md:flex items-center gap-1'>
          {['Home', 'History', 'Pricing'].map((link) => (
            <motion.button
              key={link}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
              onClick={() => navigate(link === 'Home' ? '/' : `/${link.toLowerCase()}`)}
              style={{
                color: 'rgba(255,255,255,0.6)', padding: '6px 14px',
                borderRadius: '10px', fontSize: '14px', fontWeight: 500,
                background: 'transparent', border: 'none', cursor: 'pointer',
                transition: 'all 0.2s', fontFamily: '"DM Sans", sans-serif',
              }}
            >
              {link}
            </motion.button>
          ))}
        </div>

        {/* Right Side */}
        <div className='flex items-center gap-3'>

          {/* Credits */}
          <div className='relative' onMouseDown={(e) => e.stopPropagation()}>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (!userData) { setShowAuth(true); return; }
                setShowCreditPopup(!showCreditPopup);
                setShowUserPopup(false);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                background: 'rgba(74,222,128,0.12)',
                border: '1px solid rgba(74,222,128,0.25)',
                borderRadius: '50px', padding: '7px 16px',
                color: '#4ade80', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
              }}
            >
              <BsCoin size={16} />
              {userData?.credits || 0}
            </motion.button>

            <AnimatePresence>
              {showCreditPopup && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'absolute', right: '-30px', top: 'calc(100% + 12px)',
                    width: '240px', background: 'rgba(15,15,20,0.97)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px', padding: '18px', zIndex: 100,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <BsCoin size={20} color="#4ade80" />
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>{userData?.credits || 0} Credits</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '14px', lineHeight: 1.5 }}>
                    Need more credits to continue interviews?
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/pricing")}
                    style={{
                      width: '100%', background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                      color: '#0a0a0f', border: 'none', borderRadius: '10px',
                      padding: '9px', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                    }}
                  >
                    Buy More Credits
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Avatar */}
          <div className='relative' onMouseDown={(e) => e.stopPropagation()}>
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!userData) { setShowAuth(true); return; }
                setShowUserPopup(!showUserPopup);
                setShowCreditPopup(false);
              }}
              style={{
                width: '38px', height: '38px',
                background: `${accentColor}20`,
                border: `2px solid ${accentColor}50`,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: accentColor, fontWeight: 700, fontSize: '15px',
                cursor: 'pointer',
                boxShadow: `0 0 12px ${accentColor}25`,
                transition: 'all 0.3s'
              }}
            >
              {userData?.name ? userData.name.slice(0, 1).toUpperCase() : <FaUserAstronaut size={16} />}
            </motion.button>

            <AnimatePresence>
              {showUserPopup && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 12px)',
                    width: '210px', background: 'rgba(15,15,20,0.97)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px', padding: '14px',
                    zIndex: 100, boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* User info header */}
                  <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ color: accentColor, fontWeight: 600, fontSize: '14px', margin: '0 0 2px' }}>{userData?.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userData?.email}</p>
                  </div>

                  {/* Menu items */}
                  {[
                    { icon: <BsPerson size={14} />, label: 'My Profile', path: '/profile' },
                    { icon: <BsCoin size={14} />, label: 'Interview History', path: '/history' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.path); setShowUserPopup(false); }}
                      style={{
                        width: '100%', textAlign: 'left', padding: '9px 6px',
                        color: 'rgba(255,255,255,0.6)', fontSize: '13px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        borderRadius: '8px', fontFamily: '"DM Sans", sans-serif',
                        display: 'flex', alignItems: 'center', gap: '8px',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                    >
                      {item.icon} {item.label}
                    </button>
                  ))}

                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '6px 0' }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%', textAlign: 'left', padding: '9px 6px',
                      color: '#f87171', fontSize: '13px', background: 'none',
                      border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px',
                      borderRadius: '8px', fontFamily: '"DM Sans", sans-serif',
                    }}
                  >
                    <TbLogout2 size={15} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      {showAuth ? <AuthModel onClose={() => setShowAuth(false)} /> : null}
    </div>
  )
}

export default Navbar