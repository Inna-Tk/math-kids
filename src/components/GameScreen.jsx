import React, { useState, useEffect, useRef, useCallback } from 'react'
import Confetti from './Confetti'

const LEVEL_MAX = { easy: 10, medium: 50, hard: 100, expert: 999 }
const MAX_LIVES = 3

const GOOD_MSGS = (name) => [
  `Молодец${name ? ', ' + name : ''}! 🌟`,
  `Ты умница! 💪`,
  `Отлично! 🎉`,
  name ? `Так держать, ${name}! ⭐` : `Ты звезда! ⭐`,
  `Блестяще! ✨`,
  `Супер! 🦸`,
  `Невероятно! 🚀`,
  `Просто класс! 💎`,
]
const BAD_MSGS = ['Не беда! 😊', 'Почти! 🤏', 'Бывает! 💙', 'Не страшно! 🌈']

function mkProblem(level) {
  const max = LEVEL_MAX[level]
  const op  = Math.random() > 0.5 ? '+' : '-'
  let a = Math.floor(Math.random() * (max - 1)) + 1
  let b = Math.floor(Math.random() * (max - 1)) + 1
  if (op === '-' && a < b) [a, b] = [b, a]
  if (op === '-' && a === b) a += 1
  return { a, op, b, ans: op === '+' ? a + b : a - b }
}

function beep(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const play = (freq, start, dur, vol = 0.25) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination)
      o.frequency.value = freq; o.type = 'sine'
      g.gain.setValueAtTime(vol, ctx.currentTime + start)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
      o.start(ctx.currentTime + start); o.stop(ctx.currentTime + start + dur)
    }
    if (type === 'correct') { play(523, 0, 0.12); play(659, 0.1, 0.12); play(784, 0.2, 0.25) }
    if (type === 'streak')  { [523, 659, 784, 1047].forEach((f, i) => play(f, i * 0.1, 0.2)) }
    if (type === 'wrong')   { play(220, 0, 0.15); play(180, 0.15, 0.2) }
  } catch (_) {}
}

export default function GameScreen({ level, name, totalQ, onEnd, onExit }) {
  const [problem, setProblem]   = useState(() => mkProblem(level))
  const [input, setInput]       = useState('')
  const [score, setScore]       = useState(0)
  const [stars, setStars]       = useState(0)
  const [streak, setStreak]     = useState(0)
  const [lives, setLives]       = useState(MAX_LIVES)
  const [qNum, setQNum]         = useState(1)
  const [feedback, setFeedback] = useState(null)
  const [msg, setMsg]           = useState('')
  const [confetti, setConfetti] = useState(false)
  const [mascot, setMascot]     = useState('idle')
  const inputRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(t)
  }, [problem])

  const advance = useCallback((ns, nst, nl, nq) => {
    setConfetti(false)
    if (nq > totalQ || nl <= 0) {
      onEnd(ns, nst)
    } else {
      setProblem(mkProblem(level))
      setInput('')
      setFeedback(null)
      setMsg('')
      setMascot('idle')
      setQNum(nq)
    }
  }, [level, totalQ, onEnd])

  const handleSubmit = useCallback(() => {
    if (feedback !== null) return
    const val = parseInt(input, 10)
    if (isNaN(val) || input.trim() === '') return

    if (val === problem.ans) {
      const ns       = streak + 1
      const pts      = 10 + (ns >= 5 ? 10 : ns >= 3 ? 5 : 0)
      const newScore = score + pts
      const newStars = stars + 1

      setStreak(ns); setScore(newScore); setStars(newStars)
      setFeedback('correct')
      const msgs = GOOD_MSGS(name)
      setMsg(msgs[Math.floor(Math.random() * msgs.length)])
      setMascot('dancing')
      setConfetti(true)
      beep(ns >= 3 && ns % 3 === 0 ? 'streak' : 'correct')
      setTimeout(() => advance(newScore, newStars, lives, qNum + 1), 1400)
    } else {
      const nl = lives - 1
      setStreak(0); setLives(nl)
      setFeedback('wrong')
      setMsg(BAD_MSGS[Math.floor(Math.random() * BAD_MSGS.length)])
      setMascot('sad')
      beep('wrong')
      setTimeout(() => advance(score, stars, nl, qNum + 1), 1900)
    }
  }, [feedback, input, problem, streak, score, stars, lives, qNum, name, advance])

  const onKey = (e) => { if (e.key === 'Enter') handleSubmit() }

  const pct       = ((qNum - 1) / totalQ) * 100
  const fireLevel = streak >= 10 ? 3 : streak >= 5 ? 2 : streak >= 3 ? 1 : 0

  return (
    <div className="game-screen">
      {confetti && <Confetti />}

      <div className="game-header">
        <button className="home-btn" onClick={onExit} title="В меню">🏠</button>
        <div className="score-display">
          <span className="score-icon">⭐</span>
          <span className="score-value">{score}</span>
        </div>
        <div className="progress-wrap">
          <div className="question-label">{qNum} / {totalQ}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="lives-display">
          {Array.from({ length: MAX_LIVES }, (_, i) => (
            <span key={i} className={`heart${i >= lives ? ' heart-lost' : ''}`}>
              {i < lives ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
      </div>

      {streak >= 3 && (
        <div className="streak-banner">
          {'🔥'.repeat(fireLevel)}&nbsp;Серия {streak}!&nbsp;{'🔥'.repeat(fireLevel)}
        </div>
      )}

      <div className={`game-card card${feedback === 'correct' ? ' card-correct' : feedback === 'wrong' ? ' card-wrong' : ''}`}>
        <span className={`mascot mascot-${mascot}`}>
          {mascot === 'dancing' ? '🥳' : mascot === 'sad' ? '😅' : '🐻'}
        </span>

        {msg && <div className={`feedback-msg feedback-${feedback}`}>{msg}</div>}

        <div className={`problem-display${feedback === 'wrong' ? ' shake' : ''}`}>
          <span className="problem-number">{problem.a}</span>
          <span className="problem-op">{problem.op}</span>
          <span className="problem-number">{problem.b}</span>
          <span className="problem-equals">=</span>
          {feedback === 'wrong'
            ? <span className="problem-ans-reveal">{problem.ans}</span>
            : <span className="problem-q">?</span>
          }
        </div>

        <div className="input-area">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            className={`answer-input${feedback === 'wrong' ? ' shake' : ''}`}
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/[^0-9]/g, ''))}
            onKeyDown={onKey}
            placeholder="?"
            disabled={feedback !== null}
          />
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!input.trim() || feedback !== null}
          >
            ✓ Ответить
          </button>
        </div>
      </div>
    </div>
  )
}
