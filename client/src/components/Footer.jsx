import React from 'react'
import { motion } from "framer-motion";
import { GiTargetShot } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import { BsTwitterX, BsGithub, BsLinkedin } from 'react-icons/bs';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#06060a', padding: '60px 24px 32px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>

        {/* Top section */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
          gap: '40px', marginBottom: '48px'
        }}>
          {/* Brand */}
          <div style={{ maxWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                padding: '8px', borderRadius: '10px',
                boxShadow: '0 0 16px rgba(74,222,128,0.3)'
              }}>
                <GiTargetShot size={16} color="#0a0a0f" />
              </div>
              <span style={{
                color: '#fff', fontWeight: 700, fontSize: '16px',
                fontFamily: '"Syne", sans-serif', letterSpacing: '-0.2px'
              }}>
                PrepPilot<span style={{ color: '#4ade80' }}>-AI</span>
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.7 }}>
              Empowering smarter interview preparation through AI-driven insights and real-time feedback.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '18px' }}>
              {[BsTwitterX, BsGithub, BsLinkedin].map((Icon, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.15, color: '#4ade80' }}
                  style={{
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px', padding: '8px', color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center'
                  }}
                >
                  <Icon size={15} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: 'Product',
              links: [
                { label: 'Home', path: '/' },
                { label: 'Interview', path: '/interview' },
                { label: 'History', path: '/history' },
                { label: 'Pricing', path: '/pricing' },
              ]
            },
            {
              title: 'Modes',
              links: [
                { label: 'HR Interview', path: '/interview' },
                { label: 'Technical Mode', path: '/interview' },
                { label: 'Resume-Based', path: '/interview' },
                { label: 'Confidence Test', path: '/interview' },
              ]
            }
          ].map((col) => (
            <div key={col.title}>
              <p style={{
                color: '#fff', fontWeight: 600, fontSize: '13px',
                marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase',
                fontFamily: '"DM Sans", sans-serif'
              }}>{col.title}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.links.map((link) => (
                  <motion.button
                    key={link.label}
                    whileHover={{ color: '#4ade80', x: 3 }}
                    onClick={() => navigate(link.path)}
                    style={{
                      color: 'rgba(255,255,255,0.45)', fontSize: '13px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left', fontFamily: '"DM Sans", sans-serif',
                      padding: 0, transition: 'color 0.2s'
                    }}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}

          {/* CTA */}
          <div style={{
            background: 'rgba(74,222,128,0.06)',
            border: '1px solid rgba(74,222,128,0.15)',
            borderRadius: '20px', padding: '24px', maxWidth: '220px'
          }}>
            <p style={{ color: '#fff', fontWeight: 600, fontSize: '15px', marginBottom: '8px' }}>
              Ready to ace your next interview?
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginBottom: '16px', lineHeight: 1.6 }}>
              Start practicing with AI today and get real-time feedback.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/interview')}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                color: '#0a0a0f', border: 'none', borderRadius: '10px',
                padding: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
              }}
            >
              Start Free →
            </motion.button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '24px' }} />

        {/* Bottom */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', fontFamily: '"DM Sans", sans-serif' }}>
            © 2026 PrepPilot-AI. All rights reserved.
          </p>
          <p style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: '12px',
            fontFamily: '"DM Sans", sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            Developed by <span style={{ color: '#4ade80', fontWeight: 600 }}>Faishal Husain</span> 
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <span key={item} style={{
                color: 'rgba(255,255,255,0.25)', fontSize: '12px', cursor: 'pointer',
                fontFamily: '"DM Sans", sans-serif'
              }}>{item}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Footer