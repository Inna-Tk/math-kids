import React from 'react'

const LEVELS = [
  { id: 'easy',   emoji: '🐣', name: 'Лёгкий',  desc: 'Числа до 10',  color: '#00b894' },
  { id: 'medium', emoji: '🐥', name: 'Средний', desc: 'Числа до 50',  color: '#0984e3' },
  { id: 'hard',   emoji: '🦅', name: 'Сложный', desc: 'Числа до 100', color: '#6c5ce7' },
  { id: 'expert', emoji: '🚀', name: 'Эксперт', desc: 'Числа до 999', color: '#e84393' },
]

export default function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <div className="start-card card">
        <span className="mascot-intro">🐻</span>
        <h1 className="start-title">Математика<br />с Мишкой!</h1>
        <p className="start-subtitle">Выбери уровень и тренируй счёт ✨</p>
        <div className="levels-grid">
          {LEVELS.map(lv => (
            <button
              key={lv.id}
              className="level-btn"
              style={{ '--c': lv.color }}
              onClick={() => onStart(lv.id)}
            >
              <span className="level-emoji">{lv.emoji}</span>
              <span className="level-name">{lv.name}</span>
              <span className="level-desc">{lv.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
