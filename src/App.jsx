import React, { useState } from 'react'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import ResultScreen from './components/ResultScreen'

export default function App() {
  const [screen, setScreen]       = useState('start')
  const [level, setLevel]         = useState('easy')
  const [playerName, setName]     = useState('')
  const [totalQ, setTotalQ]       = useState(10)
  const [finalScore, setFinalScore] = useState(0)
  const [finalStars, setFinalStars] = useState(0)

  const handleStart = ({ level, name, totalQ }) => {
    setLevel(level); setName(name); setTotalQ(totalQ)
    setScreen('game')
  }

  const handleGameEnd = (score, stars) => {
    setFinalScore(score); setFinalStars(stars)
    setScreen('result')
  }

  return (
    <div className="app">
      <div className="bg-bubbles">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`bubble bubble-${i + 1}`} />
        ))}
      </div>
      {screen === 'start' && <StartScreen onStart={handleStart} />}
      {screen === 'game' && (
        <GameScreen
          key={`${level}-${totalQ}`}
          level={level}
          name={playerName}
          totalQ={totalQ}
          onEnd={handleGameEnd}
          onExit={() => setScreen('start')}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          score={finalScore}
          stars={finalStars}
          total={totalQ}
          name={playerName}
          onRestart={() => setScreen('start')}
        />
      )}
    </div>
  )
}
