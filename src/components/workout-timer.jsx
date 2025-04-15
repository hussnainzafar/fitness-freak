"use client"

import { useState, useEffect, useRef } from "react"
import WorkoutSettingsDialog from "./workout-settings-dialog"
import WorkoutCard from "./workout-card"

export default function WorkoutTimer() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState("work") // work, rest
  const [currentRound, setCurrentRound] = useState(1)
  const [settings, setSettings] = useState({
    workTime: 30,
    restTime: 10,
    rounds: 5,
  })
  const [savedWorkouts, setSavedWorkouts] = useState([])
  const [countdown, setCountdown] = useState(0)
  const [isCountdown, setIsCountdown] = useState(false)
  const [announcementFlags, setAnnouncementFlags] = useState({
    break: false,
    complete: false,
    round: false,
  })

  const audioRef = useRef(null)

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio()

    // Load saved workouts from localStorage
    const savedWorkoutsData = localStorage.getItem("savedWorkouts")
    if (savedWorkoutsData) {
      setSavedWorkouts(JSON.parse(savedWorkoutsData))
    }
  }, [])

  // Play sound function
  const playSound = (text) => {
    // Cancel any ongoing speech before starting a new one
    window.speechSynthesis.cancel()

    if (audioRef.current) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0
      window.speechSynthesis.speak(utterance)
    }
  }

  // Countdown effect
  useEffect(() => {
    let interval
    if (isCountdown && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (isCountdown && countdown === 0) {
      setIsCountdown(false)
      setIsRunning(true)
      // Remove the playSound("Start") from here
    }
    return () => clearInterval(interval)
  }, [isCountdown, countdown])

  // Timer effect
  useEffect(() => {
    let interval
    if (isRunning) {
      // Play "Start" sound once when the timer first starts running
      if (phase === "work" && time === 0 && currentRound === 1 && !announcementFlags.round) {
        playSound("Start")
        setAnnouncementFlags((prev) => ({ ...prev, round: true }))
      }

      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1

          if (phase === "work" && newTime >= settings.workTime) {
            setPhase("rest")
            setTime(0)
            // Play "Break" sound once when entering rest phase
            playSound("Break")
            return 0
          } else if (phase === "rest" && newTime >= settings.restTime) {
            if (currentRound >= settings.rounds) {
              setIsRunning(false)
              setPhase("work")
              setCurrentRound(1)
              // Play "Workout complete" sound once when workout is complete
              playSound("Workout complete")
              return 0
            } else {
              // Store the next round number before updating state
              const nextRound = currentRound + 1
              setPhase("work")
              setTime(0)
              setCurrentRound(nextRound)
              // Play "Start" sound once when starting a new round
              playSound("Start")
              return 0
            }
          }

          return newTime
        })
      }, 1000)
    } else if (!isRunning) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isRunning, phase, settings, currentRound, announcementFlags])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStart = () => {
    // Reset announcement flags
    setAnnouncementFlags({
      break: false,
      complete: false,
      round: false,
    })
    // Start 4-second countdown
    setCountdown(4)
    setIsCountdown(true)
    setPhase("work")
    setCurrentRound(1)
    setTime(0)
  }

  const handleStop = () => {
    setIsRunning(false)
    setIsCountdown(false)
    playSound("Workout paused")
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsCountdown(false)
    setTime(0)
    setPhase("work")
    setCurrentRound(1)
    // Reset announcement flags
    setAnnouncementFlags({
      break: false,
      complete: false,
      round: false,
    })
    playSound("Timer reset")
  }

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings)
    localStorage.setItem("workoutSettings", JSON.stringify(newSettings))
    playSound("Settings saved")
  }

  const handleSaveWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now().toString(), // Generate a unique ID
    }
    const updatedWorkouts = [...savedWorkouts, newWorkout]
    setSavedWorkouts(updatedWorkouts)
    localStorage.setItem("savedWorkouts", JSON.stringify(updatedWorkouts))
    playSound("Workout saved")
  }

  const handleDeleteWorkout = (workoutId) => {
    const updatedWorkouts = savedWorkouts.filter((w) => w.id !== workoutId)
    setSavedWorkouts(updatedWorkouts)
    localStorage.setItem("savedWorkouts", JSON.stringify(updatedWorkouts))
    playSound("Workout deleted")
  }

  const handleStartSavedWorkout = (workout) => {
    setSettings({
      workTime: workout.workTime,
      restTime: workout.restTime,
      rounds: workout.rounds,
    })
    // Reset announcement flags
    setAnnouncementFlags({
      break: false,
      complete: false,
      round: false,
    })
    // Start 4-second countdown
    setCountdown(4)
    setIsCountdown(true)
    setPhase("work")
    setCurrentRound(1)
    setTime(0)
  }

  return (
    <div className="space-y-8">
      {/* Timer Display */}
      <div className="text-center">
        <div className="text-6xl font-bold text-white mb-4 font-mono">{isCountdown ? countdown : formatTime(time)}</div>
        <div className="text-xl text-white/80">
          {isCountdown ? (
            "Get Ready..."
          ) : isRunning ? (
            <span className="flex items-center justify-center">
              <span
                className={`inline-block w-3 h-3 rounded-full mr-2 ${phase === "work" ? "bg-green-500" : "bg-red-500"}`}
              ></span>
              {phase === "work" ? "Work Time" : "Rest Time"} - Round {currentRound}/{settings.rounds}
            </span>
          ) : (
            "Ready to Start"
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        {!isRunning && !isCountdown ? (
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Stop
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          Reset
        </button>
        <WorkoutSettingsDialog
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onSaveWorkout={handleSaveWorkout}
        />
      </div>

      {/* Saved Workouts */}
      {savedWorkouts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Saved Workouts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onStartWorkout={handleStartSavedWorkout}
                onDeleteWorkout={handleDeleteWorkout}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
