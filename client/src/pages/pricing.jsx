import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { motion } from "motion/react"
import { serverUrl } from '../App';
import axios from "axios"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { BsLightningChargeFill, BsStars } from 'react-icons/bs';

function Pricing() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("free")
  const [loadingPlan, setLoadingPlan] = useState(null)
  const dispatch = useDispatch()

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 150,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "150 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
      icon: '🎯',
      accent: 'rgba(255,255,255,0.5)',
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 400,
      description: "Great for focused practice and skill improvement.",
      features: [
        "500 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
      icon: '⚡',
      accent: '#60a5fa',
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 2300,
      description: "Best value for serious job preparation.",
      features: [
        "2300 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
      icon: '🚀',
      accent: '#4ade80',
    },
  ]

  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id)
      const amount = plan.id === "basic" ? 100 : plan.id === "pro" ? 500 : 0;
      const result = await axios.post(serverUrl + "/api/payment/order", {
        planId: plan.id, amount, credits: plan.credits,
      }, { withCredentials: true })

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "PrepPilot-AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,
        handler: async function (response) {
          try {
            const verifypay = await axios.post(serverUrl + "/api/payment/verify", response, { withCredentials: true })
            dispatch(setUserData(verifypay.data.user))
            alert("Payment Successful 🎉 Credits Added!");
            navigate("/")
          } catch (error) {
            console.log(error)
            alert("Payment verification failed ❌")
          }
        },
        theme: { color: "#4ade80" },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
      setLoadingPlan(null);
    } catch (error) {
      console.log(error)
      setLoadingPlan(null);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06060a', padding: '40px 24px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .pricing-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 28px;
          padding: 36px 32px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .pricing-card.selected {
          background: rgba(74,222,128,0.05);
          border-color: rgba(74,222,128,0.35);
          box-shadow: 0 0 40px rgba(74,222,128,0.1), 0 20px 60px rgba(0,0,0,0.4);
        }
        .pricing-card:hover:not(.default-plan) {
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .pricing-card.pro-plan {
          background: rgba(74,222,128,0.04);
          border-color: rgba(74,222,128,0.2);
        }
        .pricing-card.pro-plan.selected {
          border-color: rgba(74,222,128,0.5);
        }
        .pay-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          border: none;
          transition: all 0.2s;
          margin-top: 28px;
        }
        .pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .pay-btn-selected {
          background: linear-gradient(135deg, #4ade80, #22c55e);
          color: #06060a;
          box-shadow: 0 0 24px rgba(74,222,128,0.35);
        }
        .pay-btn-selected:hover:not(:disabled) { box-shadow: 0 0 40px rgba(74,222,128,0.5); }
        .pay-btn-unselected {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .pay-btn-unselected:hover:not(:disabled) {
          background: rgba(255,255,255,0.1);
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          padding: 6px 0;
        }
      `}</style>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '56px' }}>
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
              cursor: 'pointer', flexShrink: 0, marginTop: '4px'
            }}
          >
            <FaArrowLeft size={14} />
          </motion.button>

          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
              color: '#4ade80', fontSize: '12px', fontWeight: 600,
              padding: '5px 14px', borderRadius: '50px',
              fontFamily: '"DM Sans", sans-serif', marginBottom: '16px'
            }}>
              <BsStars size={12} /> Flexible Pricing
            </div>
            <h1 style={{
              fontFamily: '"Syne", sans-serif', fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff',
              letterSpacing: '-1px', margin: '0 0 12px'
            }}>
              Choose Your <span style={{ color: '#4ade80' }}>Plan</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: '"DM Sans", sans-serif', fontSize: '16px' }}>
              Flexible pricing to match your interview preparation goals.
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'start' }}>
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={!plan.default ? { y: -4 } : {}}
                onClick={() => !plan.default && setSelectedPlan(plan.id)}
                className={`pricing-card ${isSelected ? 'selected' : ''} ${plan.id === 'pro' ? 'pro-plan' : ''} ${plan.default ? 'default-plan' : ''}`}
              >
                {/* Glow top line for selected */}
                {isSelected && (
                  <div style={{
                    position: 'absolute', top: 0, left: '15%', right: '15%', height: '1px',
                    background: 'linear-gradient(90deg, transparent, #4ade80, transparent)'
                  }} />
                )}

                {/* Badge */}
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                    color: '#06060a', fontSize: '11px', fontWeight: 700,
                    padding: '4px 12px', borderRadius: '50px',
                    fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.04em',
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    <BsLightningChargeFill size={10} /> {plan.badge}
                  </div>
                )}
                {plan.default && (
                  <div style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)',
                    fontSize: '11px', fontWeight: 600,
                    padding: '4px 12px', borderRadius: '50px',
                    fontFamily: '"DM Sans", sans-serif',
                  }}>Default</div>
                )}

                {/* Icon */}
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>{plan.icon}</div>

                {/* Name */}
                <h3 style={{
                  color: '#fff', fontFamily: '"Syne", sans-serif',
                  fontWeight: 700, fontSize: '20px', margin: '0 0 6px'
                }}>{plan.name}</h3>

                <p style={{
                  color: 'rgba(255,255,255,0.35)', fontFamily: '"DM Sans", sans-serif',
                  fontSize: '13px', lineHeight: 1.6, margin: '0 0 20px'
                }}>{plan.description}</p>

                {/* Price */}
                <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{
                    fontFamily: '"Syne", sans-serif', fontWeight: 800,
                    fontSize: '40px', color: plan.id === 'pro' ? '#4ade80' : '#fff'
                  }}>{plan.price}</span>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)',
                    color: '#4ade80', fontSize: '12px', fontWeight: 600,
                    padding: '3px 10px', borderRadius: '50px',
                    fontFamily: '"DM Sans", sans-serif', marginLeft: '10px', verticalAlign: 'middle'
                  }}>
                    {plan.credits} credits
                  </div>
                </div>

                {/* Features */}
                <div style={{ marginBottom: '4px' }}>
                  {plan.features.map((feature, i) => (
                    <div key={i} className='feature-item'>
                      <FaCheckCircle size={13} color="#4ade80" style={{ flexShrink: 0 }} />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Button */}
                {!plan.default && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    disabled={loadingPlan === plan.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSelected) {
                        setSelectedPlan(plan.id)
                      } else {
                        handlePayment(plan)
                      }
                    }}
                    className={`pay-btn ${isSelected ? 'pay-btn-selected' : 'pay-btn-unselected'}`}
                  >
                    {loadingPlan === plan.id
                      ? "Processing..."
                      : isSelected
                        ? `Pay ${plan.price} →`
                        : "Select Plan"}
                  </motion.button>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Bottom trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            textAlign: 'center', marginTop: '40px',
            color: 'rgba(255,255,255,0.2)', fontFamily: '"DM Sans", sans-serif', fontSize: '13px'
          }}
        >
          🔒 Secure payments via Razorpay &nbsp;•&nbsp; Credits never expire &nbsp;•&nbsp; Instant activation
        </motion.p>
      </div>
    </div>
  )
}

export default Pricing