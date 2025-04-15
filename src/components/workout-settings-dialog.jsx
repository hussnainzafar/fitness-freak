import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

export default function WorkoutSettingsDialog({ settings, onSettingsChange, onSaveWorkout }) {
  const [localSettings, setLocalSettings] = useState(settings)
  const [workoutName, setWorkoutName] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  // Update local settings when props change
  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSave = () => {
    onSettingsChange(localSettings)
    
    // Save workout with name
    if (workoutName.trim()) {
      onSaveWorkout({
        name: workoutName,
        ...localSettings
      })
    }
    
    setIsOpen(false)
  }

  const handleClose = () => {
    // Save settings when dialog is closed
    onSettingsChange(localSettings)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) {
        handleClose()
      }
    }}>
      <DialogTrigger className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
        Workout Settings
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Your Workout</DialogTitle>
          <DialogDescription>
            Adjust your workout parameters to match your fitness goals.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="workoutName" className="text-right text-white">
              Workout Name
            </label>
            <input
              id="workoutName"
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Enter workout name"
              className="col-span-3 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="workTime" className="text-right text-white">
              Work Time
            </label>
            <input
              id="workTime"
              type="number"
              value={localSettings.workTime}
              onChange={(e) => setLocalSettings({...localSettings, workTime: parseInt(e.target.value)})}
              className="col-span-3 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="restTime" className="text-right text-white">
              Rest Time
            </label>
            <input
              id="restTime"
              type="number"
              value={localSettings.restTime}
              onChange={(e) => setLocalSettings({...localSettings, restTime: parseInt(e.target.value)})}
              className="col-span-3 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="rounds" className="text-right text-white">
              Rounds
            </label>
            <input
              id="rounds"
              type="number"
              value={localSettings.rounds}
              onChange={(e) => setLocalSettings({...localSettings, rounds: parseInt(e.target.value)})}
              className="col-span-3 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Save Workout
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 