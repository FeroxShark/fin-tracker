import { useState } from 'react'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <div className="h-screen flex items-center justify-center">
      {loggedIn ? (
        <h1 className="text-2xl font-bold">Hola mundo</h1>
      ) : (
        <button
          onClick={() => setLoggedIn(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Login
        </button>
      )}
    </div>
  )
}

export default App
