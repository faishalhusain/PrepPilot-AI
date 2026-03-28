import React from 'react'
import { SiImmich } from "react-icons/si";
import { LuSparkle } from "react-icons/lu";
import { motion } from "framer-motion";   // ✅ FIXED
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from '../utils/firebase';
import { serverUrl } from '../App';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Auth({ isModel = false }) {   // ✅ FIXED
    const dispatch = useDispatch();

    const handleGoogleAuth = async () => {   // ✅ MOVED INSIDE
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

    return (
        <div className={`
            w-full
            ${isModel ? "py-4" : "min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20" }
        `}>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className={`
                    w-full
                    ${isModel ?"max-w-md p-8 rounded-3xl ": "max-w-lg p-12 rounded-[32px]"}
                `}>

                <div className='flex items-center justify-center gap-3 mb-6'>
                    <div className='bg-black text-white p-2 rounded-lg'>
                        <SiImmich size={18} />
                    </div>
                    <h2 className='font-semibold text-lg'>PrepPilot-AI</h2>
                </div>

                <h1 className='text-xl md:text-2xl font-semibold text-center leading-snug m'>
                    Continue with
                    <span className='bg-blue-100 text-blue-500 px-3 py-1 rounded-full inline-flex items-center gap-2'>
                        <LuSparkle size={18} />
                        AI Smart Interviewer
                    </span>
                </h1>

                <br />

                <p className='text-gray-500 text-center text:sm md:text-base leading-relaxedmb-8'>
                    Welcome to PrepPilot-AI — Sign in to start your smart interview preparation journey.
                </p>

                <br />

                <motion.button 
                    onClick={handleGoogleAuth}
                    whileHover={{opacity:0.9, scale:1.03}}
                    whileTap={{opacity:1,scale:0.98}}
                    className='w-full flex justify-center items-center gap-3 p-3 bg-gray-900 text-white rounded-full shadow-md'>
                    <FcGoogle size={20}/>
                    Continue with Google
                </motion.button>

            </motion.div>
        </div>
    )
}

export default Auth;