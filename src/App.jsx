import React, { useState } from 'react'
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import ResultScreen from './components/ResultScreen'

export default function App() {
  const [screen, setScreen] = useState('start')
  const [level, setLevel] = useState('easy')
  const [finalScore, setFinalScore] = useState(0)
  const [finalStars, setFinalStars] = useState(0)

  const handleStart = (selectedLevel) => {
    setLevel(selectedLevel)
    setScreen('game')
  }

  const handleGameEnd = (score, stars) => {
    setFinalScore(score)
    setFinalStars(stars)
    setScreen('result')
  }

  const handleRestart = () => {
    setScreen('start')
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
        <GameScreen key={level} level={level} onEnd={handleGameEnd} />
      )}
      {screen === 'result' && (
        <ResultScreen score={finalScore} stars={finalStars} onRestart={handleRestart} />
      )}
    </div>
  )
}
