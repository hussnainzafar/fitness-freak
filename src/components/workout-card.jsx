import { useState } from "react"

export default function WorkoutCard({ workout, onStartWorkout, onDeleteWorkout }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      className={`bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 shadow-lg transition-all duration-300 ${
        isHovered ? "transform scale-105 shadow-xl" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-white">{workout.name}</h3>
        <button 
          onClick={() => onDeleteWorkout(workout.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-gray-700/50 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-400">Work Time</div>
          <div className="text-white font-medium">{workout.workTime}s</div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-400">Rest Time</div>
          <div className="text-white font-medium">{workout.restTime}s</div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-2 text-center">
          <div className="text-xs text-gray-400">Rounds</div>
          <div className="text-white font-medium">{workout.rounds}</div>
        </div>
      </div>
      
      <button
        onClick={() => onStartWorkout(workout)}
        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
      >
        Start Workout
      </button>
    </div>
  )
} 