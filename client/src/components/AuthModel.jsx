import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Auth from '../pages/Auth';

const AuthModel = ({ onClose }) => {
    const { userData } = useSelector((state) => state.user)

    useEffect(() => {
        if (userData) {
            onClose()
        }
    }, [userData, onClose])

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                    position: 'fixed', inset: 0, zIndex: 999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '16px',
                    background: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                }}
                onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
            >
                <div style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>

                    {/* Close button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.1, background: 'rgba(248,113,113,0.15)' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '-14px', right: '-14px',
                            zIndex: 10,
                            width: '36px', height: '36px',
                            background: 'rgba(255,255,255,0.07)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'rgba(255,255,255,0.5)',
                            transition: 'all 0.2s',
                        }}
                    >
                        <FaTimes size={13} />
                    </motion.button>

                    <Auth isModel={true} />
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default AuthModel