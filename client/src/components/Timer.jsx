import React from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

function Timer({ timeLeft, totalTime }) {
  const percentage = (timeLeft / totalTime) * 100

  const getColor = () => {
    if (percentage > 50) return '#4ade80'
    if (percentage > 25) return '#fbbf24'
    return '#f87171'
  }

  const color = getColor()

  return (
    <div style={{ position: 'relative', width: '88px', height: '88px' }}>
      {/* Outer glow ring */}
      <div style={{
        position: 'absolute', inset: '-4px', borderRadius: '50%',
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />
      <CircularProgressbar
        value={percentage}
        text={`${timeLeft}s`}
        styles={buildStyles({
          textSize: '22px',
          pathColor: color,
          textColor: color,
          trailColor: 'rgba(255,255,255,0.07)',
          pathTransitionDuration: 0.8,
          strokeLinecap: 'round',
        })}
      />
    </div>
  )
}

export default Timer