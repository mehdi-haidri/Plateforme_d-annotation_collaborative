import { useContext, useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { Loader2, Lock, Mail, LogIn } from "lucide-react"
import roles from "../config/roles"
import { AlertContext } from "../App"

const API_URL = import.meta.env.VITE_API_URL

const SignInSection = () => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("1234567")
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { setAlert } = useContext(AlertContext)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
      })
      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("token", data?.data.token)
        localStorage.setItem("role", data?.data.role)
        navigate(roles[data?.data.role])
      } else {
        setAlert({ type: "error", message: "Login failed" })
        console.log("Login failed")
      }
    } catch (error) {
      console.error("An error occurred during login:", error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate(roles[localStorage.getItem("role")])
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Dark background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0e1a] to-[#151933] z-0">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
          }}
        ></div>

        {/* Subtle glow effect */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="z-10 w-full max-w-md px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-sm rounded-xl mb-4">
            <LogIn className="h-6 w-6 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">DataAnnotation</h1>
          <p className="text-gray-400">Sign in to access your dashboard</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-xl border border-white/10 p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Welcome back</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-200">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  id="email"
                  className="bg-white/5 border border-gray-600 text-white rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2.5"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-200">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-white/5 border border-gray-600 text-white rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2.5"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-purple-400 hover:text-purple-300">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-5 py-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign in
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <a href="#" className="font-medium text-purple-400 hover:text-purple-300">
                Sign up
              </a>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">© 2025 DataAnnotation. All rights reserved.</p>
      </div>
    </div>
  )
}


export default SignInSection