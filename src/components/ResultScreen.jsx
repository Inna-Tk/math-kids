import React, { useEffect, useState } from 'react'
import Confetti from './Confetti'

function grade(stars, total) {
  const r = stars / total
  if (r >= 0.9) return { emoji: '🏆', title: 'Чемпион!',   sub: 'Потрясающий результат — ты настоящий математик!' }
  if (r >= 0.7) return { emoji: '🥇', title: 'Отлично!',   sub: 'Ты очень хорошо справился!' }
  if (r >= 0.5) return { emoji: '🥈', title: 'Хорошо!',    sub: 'Продолжай тренироваться!' }
  return               { emoji: '🌱', title: 'Растём!',     sub: 'Попробуй ещё раз — у тебя получится!' }
}

export default function ResultScreen({ score, stars, total, name, onRestart }) {
  const [visible, setVisible]     = useState(false)
  const [showConfetti, setShowConf] = useState(false)
  const g = grade(stars, total)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 80)
    const t2 = setTimeout(() => {
      if (stars / total >= 0.7) {
        setShowConf(true)
        setTimeout(() => setShowConf(false), 4000)
      }
    }, 400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [stars, total])

  const titleWithName = name ? `${g.title.replace('!', ',')} ${name}!` : g.title

  return (
    <div className="result-screen">
      {showConfetti && <Confetti />}
      <div className={`result-card card${visible ? ' visible' : ''}`}>
        <span className="result-trophy">{g.emoji}</span>
        <h2 className="result-title">{titleWithName}</h2>
        <p className="result-subtitle">{g.sub}</p>

        <div className="result-stats">
          <div className="stat-box">
            <span className="stat-icon">⭐</span>
            <span className="stat-label">Очки</span>
            <span className="stat-val">{score}</span>
          </div>
          <div className="stat-box">
            <span className="stat-icon">✅</span>
            <span className="stat-label">Верных</span>
            <span className="stat-val">{stars}/{total}</span>
          </div>
        </div>

        <div className="stars-row">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={`result-star${i >= stars ? ' dim' : ''}`}
              style={{ animationDelay: `${0.15 + i * 0.08}s` }}
            >
              {i < stars ? '⭐' : '☆'}
            </span>
          ))}
        </div>

        <button className="restart-btn" onClick={onRestart}>
          🎮 Играть снова!
        </button>
      </div>
    </div>
  )
}
