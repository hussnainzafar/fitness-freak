import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Play, Pause } from "lucide-react"



type Session = {
  id: string
  name: string
  startTime: number
  breakTime: number
}

type TimerState = {
  isActive: boolean
  currentSession: Session | null
  phase: "countdown" | "workout" | "break"
  timeLeft: number
  cyclesCompleted: number
}

export default function WorkoutTimer() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newSession, setNewSession] = useState<Omit<Session, "id">>({
    name: "",
    startTime: 10,
    breakTime: 5,
  })

  const [timerState, setTimerState] = useState<TimerState>({
    isActive: false,
    currentSession: null,
    phase: "countdown",
    timeLeft: 0,
    cyclesCompleted: 0,
  })

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (timerState.isActive) {
      timerRef.current = setInterval(() => {
        setTimerState((prev) => {
          if (prev.timeLeft <= 1) {
            // Time's up for current phase
            if (prev.phase === "countdown") {
              // After countdown, start workout
              speakMessage("Your workout time starts now")
              return {
                ...prev,
                phase: "workout",
                timeLeft: prev.currentSession?.startTime || 0,
              }
            } else if (prev.phase === "workout") {
              // After workout, start break
              speakMessage("Break time")
              return {
                ...prev,
                phase: "break",
                timeLeft: prev.currentSession?.breakTime || 0,
              }
            } else {
              // After break, check if we need another cycle
              const newCyclesCompleted = prev.cyclesCompleted + 1

              if (newCyclesCompleted >= 3) {
                // Session complete after 3 cycles
                clearInterval(timerRef.current!)
                speakMessage("Workout complete")
                return {
                  ...prev,
                  isActive: false,
                  phase: "countdown",
                  cyclesCompleted: 0,
                }
              } else {
                // Start next cycle with workout
                speakMessage("Your workout time starts now")
                return {
                  ...prev,
                  phase: "workout",
                  timeLeft: prev.currentSession?.startTime || 0,
                  cyclesCompleted: newCyclesCompleted,
                }
              }
            }
          } else {
            // Just decrement time
            return {
              ...prev,
              timeLeft: prev.timeLeft - 1,
            }
          }
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [timerState.isActive])

  const speakMessage = (message: string) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(message)
      window.speechSynthesis.speak(speech)
    }
  }

  const handleAddSession = () => {
    setDialogOpen(true)
  }

  const handleSaveSession = () => {
    if (newSession.name.trim() === "") {
      alert("Please enter a session name")
      return
    }

    const session: Session = {
      id: Date.now().toString(),
      ...newSession,
    }

    setSessions((prev) => [...prev, session])
    setDialogOpen(false)
    setNewSession({
      name: "",
      startTime: 10,
      breakTime: 5,
    })
  }

  const startSession = (session: Session) => {
    // Stop any current session
    if (timerState.isActive && timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Start with 4 second countdown
    setTimerState({
      isActive: true,
      currentSession: session,
      phase: "countdown",
      timeLeft: 4,
      cyclesCompleted: 0,
    })

    speakMessage(`Starting session ${session.name} in 4 seconds`)
  }

  const pauseResumeTimer = () => {
    setTimerState((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }))
  }

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setTimerState({
      isActive: false,
      currentSession: null,
      phase: "countdown",
      timeLeft: 0,
      cyclesCompleted: 0,
    })
  }

  const getPhaseLabel = () => {
    switch (timerState.phase) {
      case "countdown":
        return "Get Ready"
      case "workout":
        return "Workout"
      case "break":
        return "Break"
      default:
        return ""
    }
  }

  const getProgressColor = () => {
    switch (timerState.phase) {
      case "countdown":
        return "bg-yellow-500"
      case "workout":
        return "bg-green-500"
      case "break":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Workout Sessions</h2>
        <Button onClick={handleAddSession}>
          <Plus className="mr-2 h-4 w-4" />
          Add Session
        </Button>
      </div>

      {timerState.currentSession && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between">
              <span>{timerState.currentSession.name}</span>
              <span>Cycle {timerState.cyclesCompleted + 1}/3</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">{getPhaseLabel()}</span>
                <span className="text-3xl font-bold tabular-nums">{formatTime(timerState.timeLeft)}</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${getProgressColor()}`}
                  style={{
                    width: `${
                      timerState.phase === "countdown"
                        ? (timerState.timeLeft / 4) * 100
                        : timerState.phase === "workout"
                          ? (timerState.timeLeft / timerState.currentSession.startTime) * 100
                          : (timerState.timeLeft / timerState.currentSession.breakTime) * 100
                    }%`,
                  }}
                ></div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant={timerState.isActive ? "outline" : "default"}
                  onClick={pauseResumeTimer}
                  className="flex-1"
                >
                  {timerState.isActive ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Resume
                    </>
                  )}
                </Button>
                <Button variant="destructive" onClick={resetTimer} className="flex-1">
                  Stop
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((session) => (
          <Card
            key={session.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => startSession(session)}
          >
            <CardHeader className="pb-2">
              <CardTitle>{session.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Workout:</span>
                  <span className="font-medium">{formatTime(session.startTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Break:</span>
                  <span className="font-medium">{formatTime(session.breakTime)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-12 bg-gray-100 rounded-lg">
          <p className="text-gray-500">No workout sessions yet. Click "Add Session" to create one.</p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Workout Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="session-name">Session Name</Label>
              <Input
                id="session-name"
                value={newSession.name}
                onChange={(e) => setNewSession((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., HIIT Workout"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-time">Workout Time (seconds)</Label>
              <Input
                id="start-time"
                type="number"
                min="1"
                value={newSession.startTime}
                onChange={(e) =>
                  setNewSession((prev) => ({ ...prev, startTime: Number.parseInt(e.target.value) || 10 }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="break-time">Break Time (seconds)</Label>
              <Input
                id="break-time"
                type="number"
                min="1"
                value={newSession.breakTime}
                onChange={(e) =>
                  setNewSession((prev) => ({ ...prev, breakTime: Number.parseInt(e.target.value) || 5 }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSession}>Save Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
