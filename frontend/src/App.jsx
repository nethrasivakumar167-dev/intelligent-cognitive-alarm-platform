import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState("Waiting for backend...")

  useEffect(() => {
    // Make a GET request to the FastAPI health route
    axios.get('http://localhost:8000/api/health')
      .then(response => {
        // Update the state with the string received from FastAPI
        setMessage(response.data.status)
      })
      .catch(error => {
        console.error("Error connecting to backend:", error)
        setMessage("Connection failed. Is the backend running?")
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Backend Status</p>
        <p className="mt-2 text-lg font-semibold text-slate-900">{message}</p>
      </div>
    </div>
  )
}

export default App