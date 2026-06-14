import React, { useMemo } from 'react'

const COLORS = ['#fd79a8', '#fdcb6e', '#6c5ce7', '#00b894', '#0984e3', '#e17055', '#55efc4', '#a29bfe', '#ffeaa7', '#ff7675']

export default function Confetti() {
  const pieces = useMemo(() => (
    Array.from({ length: 70 }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      left: Math.random() * 100,
      delay: Math.random() * 0.7,
      duration: 1.8 + Math.random() * 1.6,
      size: 7 + Math.random() * 11,
      spin: 180 + Math.round(Math.random() * 540),
      round: Math.random() > 0.45 ? '50%' : '2px',
    }))
  ), [])

  return (
    <div className="confetti-wrap" aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          className="cp"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--r': p.round,
            '--spin': p.spin,
          }}
        />
      ))}
    </div>
  )
}
