import WorkoutTimer from "@/components/workout-timer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-white drop-shadow-lg">
        BurnClock
        </h1>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 md:p-8">
          <WorkoutTimer />
        </div>
      </div>
    </main>
  )
}
