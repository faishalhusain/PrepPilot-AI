import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { BsDownload, BsTrophy, BsChatSquareText, BsLightningCharge } from 'react-icons/bs';

function Step3Report({ report }) {
  if (!report) {
    return (
      <div style={{ minHeight: '100vh', background: '#06060a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(74,222,128,0.3)', borderTopColor: '#4ade80', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: '"DM Sans", sans-serif' }}>Loading Report...</p>
        </div>
      </div>
    );
  }

  const navigate = useNavigate()

  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0
  }))

  const skills = [
    { label: "Confidence", value: confidence, color: '#4ade80' },
    { label: "Communication", value: communication, color: '#60a5fa' },
    { label: "Correctness", value: correctness, color: '#a78bfa' },
  ];

  let performanceText = "", shortTagline = "", perfColor = '';
  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
    perfColor = '#4ade80';
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement.";
    shortTagline = "Good foundation, refine articulation.";
    perfColor = '#fbbf24';
  } else {
    performanceText = "Significant improvement needed.";
    shortTagline = "Work on clarity and confidence.";
    perfColor = '#f87171';
  }

  const percentage = (finalScore / 10) * 100;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let currentY = 25;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(34, 197, 94);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, { align: "center" });
    currentY += 5;
    doc.setDrawColor(34, 197, 94);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);
    currentY += 15;
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Final Score: ${finalScore}/10`, pageWidth / 2, currentY + 12, { align: "center" });
    currentY += 30;
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");
    doc.setFontSize(12);
    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);
    currentY += 45;
    let advice = finalScore >= 8
      ? "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples."
      : finalScore >= 5
        ? "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples."
        : "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud.";
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220);
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);
    doc.setFont("helvetica", "bold");
    doc.text("Professional Advice", margin + 10, currentY + 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);
    currentY += 50;
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q, i) => [`${i + 1}`, q.question, `${q.score}/10`, q.feedback]),
      styles: { fontSize: 9, cellPadding: 5, valign: "top" },
      headStyles: { fillColor: [34, 197, 94], textColor: 255, halign: "center" },
      columnStyles: { 0: { cellWidth: 10, halign: "center" }, 1: { cellWidth: 55 }, 2: { cellWidth: 20, halign: "center" }, 3: { cellWidth: "auto" } },
      alternateRowStyles: { fillColor: [249, 250, 251] },
    });
    doc.save("AI_Interview_Report.pdf");
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'rgba(15,15,20,0.97)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '10px', padding: '10px 14px' }}>
          <p style={{ color: '#4ade80', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', fontWeight: 700, margin: 0 }}>
            Score: {payload[0].value}/10
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#06060a', padding: '32px 20px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        .r3-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
        }
        .q-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          padding: 22px;
          transition: border-color 0.2s;
        }
        .q-card:hover { border-color: rgba(74,222,128,0.2); }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/history")}
              style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', flexShrink: 0
              }}
            >
              <FaArrowLeft size={14} />
            </motion.button>
            <div>
              <h1 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '26px', color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
                Interview Analytics
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', margin: '3px 0 0' }}>
                AI-powered performance insights
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={downloadPDF}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #4ade80, #22c55e)',
              color: '#06060a', border: 'none', borderRadius: '12px',
              padding: '12px 22px', fontWeight: 700, fontSize: '14px',
              cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
              boxShadow: '0 0 20px rgba(74,222,128,0.25)'
            }}
          >
            <BsDownload size={15} /> Download PDF
          </motion.button>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'start' }}>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Score card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className='r3-card'
              style={{ padding: '28px', textAlign: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                <BsTrophy size={16} color="#fbbf24" />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontFamily: '"DM Sans", sans-serif', fontSize: '13px' }}>Overall Performance</span>
              </div>

              <div style={{ width: '120px', height: '120px', margin: '0 auto 20px' }}>
                <CircularProgressbar
                  value={percentage}
                  text={`${finalScore}/10`}
                  styles={buildStyles({
                    textSize: '18px',
                    pathColor: perfColor,
                    textColor: '#fff',
                    trailColor: 'rgba(255,255,255,0.07)',
                    pathTransitionDuration: 1,
                  })}
                />
              </div>

              <div style={{
                display: 'inline-block',
                background: `${perfColor}15`, border: `1px solid ${perfColor}30`,
                borderRadius: '50px', padding: '5px 16px', marginBottom: '12px'
              }}>
                <span style={{ color: perfColor, fontSize: '12px', fontWeight: 700, fontFamily: '"DM Sans", sans-serif' }}>
                  {finalScore >= 8 ? '🏆 Excellent' : finalScore >= 5 ? '⚡ Good' : '📈 Needs Work'}
                </span>
              </div>
              <p style={{ color: '#fff', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '14px', margin: '0 0 4px' }}>{performanceText}</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontFamily: '"DM Sans", sans-serif', fontSize: '13px', margin: 0 }}>{shortTagline}</p>
            </motion.div>

            {/* Skill bars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className='r3-card'
              style={{ padding: '24px 28px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <BsLightningCharge size={14} color="#4ade80" />
                <h3 style={{ color: '#fff', fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '16px', margin: 0 }}>Skill Evaluation</h3>
              </div>
              {skills.map((s, i) => (
                <div key={i} style={{ marginBottom: i < skills.length - 1 ? '18px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontFamily: '"DM Sans", sans-serif', fontSize: '13px' }}>{s.label}</span>
                    <span style={{ color: s.color, fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '14px' }}>{s.value}</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '50px', height: '6px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.value * 10}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                      style={{ height: '100%', borderRadius: '50px', background: `linear-gradient(90deg, ${s.color}, ${s.color}99)` }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', gridColumn: 'span 2' }}>

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className='r3-card'
              style={{ padding: '24px 28px' }}
            >
              <h3 style={{ color: '#fff', fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '16px', margin: '0 0 20px' }}>Performance Trend</h3>
              <div style={{ height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={questionScoreData}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: '"DM Sans", sans-serif' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="score" stroke="#4ade80" fill="url(#scoreGrad)" strokeWidth={2.5} dot={{ fill: '#4ade80', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#4ade80' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Question breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className='r3-card'
              style={{ padding: '24px 28px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <BsChatSquareText size={14} color="#4ade80" />
                <h3 style={{ color: '#fff', fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: '16px', margin: 0 }}>Question Breakdown</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {questionWiseScore.map((q, i) => {
                  const sc = q.score ?? 0;
                  const scColor = sc >= 8 ? '#4ade80' : sc >= 5 ? '#fbbf24' : '#f87171';
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.05 }}
                      className='q-card'
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                            Question {i + 1}
                          </p>
                          <p style={{ color: '#fff', fontFamily: '"DM Sans", sans-serif', fontSize: '14px', fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
                            {q.question || "Question not available"}
                          </p>
                        </div>
                        <div style={{
                          background: `${scColor}15`, border: `1px solid ${scColor}30`,
                          color: scColor, padding: '4px 12px', borderRadius: '50px',
                          fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '13px',
                          flexShrink: 0, whiteSpace: 'nowrap'
                        }}>
                          {sc}/10
                        </div>
                      </div>
                      <div style={{
                        background: 'rgba(74,222,128,0.04)',
                        border: '1px solid rgba(74,222,128,0.1)',
                        borderRadius: '12px', padding: '12px 14px'
                      }}>
                        <p style={{ color: '#4ade80', fontSize: '10px', fontFamily: '"DM Sans", sans-serif', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 5px' }}>
                          AI Feedback
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.65, margin: 0 }}>
                          {q.feedback && q.feedback.trim() !== "" ? q.feedback : "No feedback available for this question."}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step3Report