import WorkoutTimer from "@/components/workout-timer"


export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">BurnClock</h1>
        <WorkoutTimer />
      </div>
    </main>
  )
}
