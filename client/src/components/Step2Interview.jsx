import React, { useEffect, useState, useRef } from 'react'
import maleVideo from "../assets/videos/male-ai.mp4"
import femaleVideo from "../assets/videos/female-ai.mp4"
import Timer from "../components/Timer"
import { motion } from "motion/react"
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'
import axios from "axios"
import { serverUrl } from '../App'
import { BsArrowRight } from 'react-icons/bs'

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const videoRef = useRef(null);
  const currentQuestion = questions[currentIndex]

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const femaleVoice = voices.find(v =>
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("female")
      );
      if (femaleVoice) { setSelectedVoice(femaleVoice); setVoiceGender("female"); return; }
      const maleVoice = voices.find(v =>
        v.name.toLowerCase().includes("david") ||
        v.name.toLowerCase().includes("mark") ||
        v.name.toLowerCase().includes("male")
      );
      if (maleVoice) { setSelectedVoice(maleVoice); setVoiceGender("male"); return; }
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) { resolve(); return; }
      window.speechSynthesis.cancel();
      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");
      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;
      utterance.onstart = () => { setIsAIPlaying(true); stopMic(); videoRef.current?.play(); };
      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);
        if (isMicOn) startMic();
        setTimeout(() => { setSubtitle(""); resolve(); }, 300);
      };
      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) return;
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(`Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`);
        await speakText("I'll ask you a few questions. Just answer naturally, and take your time. Let's begin.");
        setIsIntroPhase(false)
      } else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800));
        if (currentIndex === questions.length - 1) await speakText("Alright, this one might be a bit more challenging.");
        await speakText(currentQuestion.question);
        if (isMicOn) startMic();
      }
    };
    runIntro()
  }, [selectedVoice, isIntroPhase, currentIndex])

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex]);

  useEffect(() => {
    if (!isIntroPhase && currentQuestion) setTimeLeft(currentQuestion.timeLimit || 60);
  }, [currentIndex]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };
    recognitionRef.current = recognition;
  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) { try { recognitionRef.current.start(); } catch { } }
  };
  const stopMic = () => { if (recognitionRef.current) recognitionRef.current.stop(); };
  const toggleMic = () => { if (isMicOn) stopMic(); else startMic(); setIsMicOn(!isMicOn); };

  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true)
    try {
      const result = await axios.post(serverUrl + "/api/interview/submit-answer", {
        interviewId, questionIndex: currentIndex, answer,
        timeTaken: currentQuestion.timeLimit - timeLeft,
      }, { withCredentials: true })
      setFeedback(result.data.feedback)
      speakText(result.data.feedback)
      setIsSubmitting(false)
    } catch (error) { console.log(error); setIsSubmitting(false) }
  }

  const handleNext = async () => {
    setAnswer(""); setFeedback("");
    if (currentIndex + 1 >= questions.length) { finishInterview(); return; }
    await speakText("Alright, let's move to the next question.");
    setCurrentIndex(currentIndex + 1);
    setTimeout(() => { if (isMicOn) startMic(); }, 500);
  }

  const finishInterview = async () => {
    stopMic(); setIsMicOn(false);
    try {
      const result = await axios.post(serverUrl + "/api/interview/finish", { interviewId }, { withCredentials: true })
      onFinish(result.data)
    } catch (error) { console.log(error) }
  }

  useEffect(() => {
    if (!isIntroPhase && currentQuestion && timeLeft === 0 && !isSubmitting && !feedback) submitAnswer()
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current.abort(); }
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#06060a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 16px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .s2-textarea {
          flex: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 18px 20px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          resize: none;
          outline: none;
          min-height: 140px;
          transition: border-color 0.2s;
          line-height: 1.7;
        }
        .s2-textarea:focus { border-color: rgba(74,222,128,0.35); }
        .s2-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .mic-pulse {
          animation: micpulse 1.5s ease-in-out infinite;
        }
        @keyframes micpulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
          50% { box-shadow: 0 0 0 10px rgba(74,222,128,0); }
        }
      `}</style>

      <div style={{
        width: '100%', maxWidth: '1000px',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '28px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        minHeight: '75vh',
        boxShadow: '0 40px 120px rgba(0,0,0,0.6)'
      }}>

        {/* LEFT — VIDEO + TIMER */}
        <div style={{
          width: '300px', minWidth: '260px', flexShrink: 0,
          background: 'rgba(255,255,255,0.02)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          padding: '28px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'
        }}>

          {/* AI label */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AI Interviewer
            </span>
            {isAIPlaying && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)',
                  color: '#4ade80', fontSize: '11px', fontWeight: 600,
                  padding: '3px 10px', borderRadius: '50px',
                  fontFamily: '"DM Sans", sans-serif'
                }}>
                <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%', display: 'inline-block', animation: 'micpulse 1s infinite' }} />
                Speaking
              </motion.span>
            )}
          </div>

          {/* Video */}
          <div style={{
            width: '100%', borderRadius: '16px', overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: isAIPlaying ? '0 0 24px rgba(74,222,128,0.2)' : 'none',
            transition: 'box-shadow 0.3s'
          }}>
            <video src={videoSource} key={videoSource} ref={videoRef} muted playsInline preload='auto'
              style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
          </div>

          {/* Subtitle */}
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              style={{
                width: '100%',
                background: 'rgba(74,222,128,0.05)',
                border: '1px solid rgba(74,222,128,0.15)',
                borderRadius: '12px', padding: '12px 14px'
              }}
            >
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
                {subtitle}
              </p>
            </motion.div>
          )}

          {/* Timer + Stats */}
          <div style={{
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px', padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit} />
            </div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '16px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'center' }}>
              {[
                { val: currentIndex + 1, label: 'Current' },
                { val: questions.length, label: 'Total' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ color: '#4ade80', fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '24px' }}>{s.val}</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontFamily: '"DM Sans", sans-serif' }}>{s.label} Q</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — QUESTION + ANSWER */}
        <div style={{ flex: 1, minWidth: '280px', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: '20px', color: '#fff', margin: 0 }}>
              AI Smart Interview
            </h2>
            {/* Progress dots */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  width: i === currentIndex ? '20px' : '8px',
                  height: '8px', borderRadius: '4px',
                  background: i < currentIndex ? '#4ade80' : i === currentIndex ? '#4ade80' : 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s'
                }} />
              ))}
            </div>
          </div>

          {/* Question card */}
          {!isIntroPhase && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(74,222,128,0.04)',
                border: '1px solid rgba(74,222,128,0.15)',
                borderRadius: '16px', padding: '20px 22px'
              }}
            >
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Question {currentIndex + 1} of {questions.length}
              </p>
              <p style={{ color: '#fff', fontFamily: '"DM Sans", sans-serif', fontSize: '16px', fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
                {currentQuestion?.question}
              </p>
            </motion.div>
          )}

          {isIntroPhase && (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>👋</div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: '"DM Sans", sans-serif', fontSize: '15px' }}>
                  AI is introducing itself...
                </p>
              </div>
            </div>
          )}

          {/* Answer textarea */}
          <textarea
            className='s2-textarea'
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            placeholder="Speak or type your answer here..."
          />

          {/* Buttons */}
          {!feedback ? (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.9 }}
                className={isMicOn ? 'mic-pulse' : ''}
                style={{
                  width: '52px', height: '52px', flexShrink: 0,
                  borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: isMicOn ? 'linear-gradient(135deg, #4ade80, #22c55e)' : 'rgba(248,113,113,0.15)',
                  color: isMicOn ? '#06060a' : '#f87171',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isMicOn ? '0 0 16px rgba(74,222,128,0.3)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
              </motion.button>

              <motion.button
                onClick={submitAnswer}
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                style={{
                  flex: 1, padding: '15px', borderRadius: '14px',
                  background: isSubmitting ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #4ade80, #22c55e)',
                  color: isSubmitting ? 'rgba(255,255,255,0.3)' : '#06060a',
                  border: 'none', fontWeight: 700, fontSize: '15px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontFamily: '"DM Sans", sans-serif',
                  boxShadow: isSubmitting ? 'none' : '0 0 20px rgba(74,222,128,0.25)',
                  transition: 'all 0.2s'
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(74,222,128,0.05)',
                border: '1px solid rgba(74,222,128,0.2)',
                borderRadius: '16px', padding: '20px'
              }}
            >
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>AI Feedback</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontFamily: '"DM Sans", sans-serif', fontSize: '14px', lineHeight: 1.7, margin: '0 0 16px' }}>{feedback}</p>
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: '100%', padding: '13px',
                  background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                  color: '#06060a', border: 'none', borderRadius: '12px',
                  fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                  fontFamily: '"DM Sans", sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                {currentIndex + 1 >= questions.length ? "Finish Interview 🎉" : <>Next Question <BsArrowRight size={16} /></>}
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Step2Interview