"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from "@/components/ui/dialog"

export default function WorkoutSettingsDialog({
  settings,
  onSettingsChange,
  onSaveWorkout,
  existingWorkoutNames = [],
}) {
  const [localSettings, setLocalSettings] = useState(settings)
  const [workoutName, setWorkoutName] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSave = () => {
    setError("") // Clear previous errors

    // Check if all required fields are filled
    if (!workoutName.trim()) {
      setError("Please enter a workout name.")
      return false
    }

    if (!localSettings.workTime) {
      setError("Please enter work time.")
      return false
    }

    if (!localSettings.restTime) {
      setError("Please enter rest time.")
      return false
    }

    if (!localSettings.rounds) {
      setError("Please enter number of rounds.")
      return false
    }

    // Check if workout name is unique
    const nameExists = existingWorkoutNames.some((name) => name.toLowerCase() === workoutName.trim().toLowerCase())

    if (nameExists) {
      setError("Workout name already exists. Choose a different name.")
      return false
    }

    // If all validations pass, save the workout
    onSettingsChange(localSettings)
    onSaveWorkout({
      name: workoutName.trim(),
      ...localSettings,
    })

    // Reset the form
    setWorkoutName("")

    return true // Return true to indicate successful validation
  }

  const handleClose = () => {
    onSettingsChange(localSettings)
    setError("") // Reset error on close
    setWorkoutName("") // Reset workout name on close
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          handleClose()
        }
      }}
    >
      <DialogTrigger className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
        Create Session
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Your Workout</DialogTitle>
          <DialogDescription>Adjust your workout parameters to match your fitness goals.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="workoutName" className="text-right text-white">
              Workout Name <span className="text-red-500">*</span>
            </label>
            <div className="col-span-3">
              <input
                id="workoutName"
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="Enter workout name"
                className={`w-full px-3 py-2 bg-gray-800 border ${error && !workoutName.trim() ? "border-red-500" : "border-gray-700"} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="workTime" className="text-right text-white">
              Work Time <span className="text-red-500">*</span>
            </label>
            <div className="col-span-3">
              <input
                id="workTime"
                type="number"
                value={localSettings.workTime || ""}
                onChange={(e) => setLocalSettings({ ...localSettings, workTime: Number.parseInt(e.target.value) || 0 })}
                className={`w-full px-3 py-2 bg-gray-800 border ${error && !localSettings.workTime ? "border-red-500" : "border-gray-700"} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="restTime" className="text-right text-white">
              Rest Time <span className="text-red-500">*</span>
            </label>
            <div className="col-span-3">
              <input
                id="restTime"
                type="number"
                value={localSettings.restTime || ""}
                onChange={(e) => setLocalSettings({ ...localSettings, restTime: Number.parseInt(e.target.value) || 0 })}
                className={`w-full px-3 py-2 bg-gray-800 border ${error && !localSettings.restTime ? "border-red-500" : "border-gray-700"} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="rounds" className="text-right text-white">
              Rounds <span className="text-red-500">*</span>
            </label>
            <div className="col-span-3">
              <input
                id="rounds"
                type="number"
                value={localSettings.rounds || ""}
                onChange={(e) => setLocalSettings({ ...localSettings, rounds: Number.parseInt(e.target.value) || 0 })}
                className={`w-full px-3 py-2 bg-gray-800 border ${error && !localSettings.rounds ? "border-red-500" : "border-gray-700"} rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          {error && <p className="w-full text-red-500 text-sm text-center mb-2">{error}</p>}
          <DialogClose asChild>
            <button
              onClick={(e) => {
                const isValid = handleSave()
                if (!isValid) {
                  e.preventDefault() // Prevent dialog from closing if validation fails
                }
              }}
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
