import { useAuth } from '../AuthProvider'

export default function Login() {
  const { login } = useAuth()
  return (
    <div className="h-screen flex items-center justify-center">
      <button
        onClick={login}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Sign in with Google
      </button>
    </div>
  )
}

