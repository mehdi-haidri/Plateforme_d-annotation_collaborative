import { useEffect } from "react"
import { CheckCircle, AlertCircle, AlertTriangle, X } from "lucide-react"

function Alert({ alert, setAlert }) {
  // Alert type classes mapping
  const alertTypeClasses = {
    success:
      "bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-600 dark:text-green-400",
    error: "bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-600 dark:text-red-400",
    warning:
      "bg-amber-100 border-amber-500 text-amber-700 dark:bg-amber-900/30 dark:border-amber-600 dark:text-amber-400",
  }

  // Alert icon mapping
  const alertIcons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
  }

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    setTimeout(() => {
      setAlert(null)
    }, 8000)
  })

  if (!alert) return null

  return (
    <div
      role="alert"
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-99 flex items-center p-4 mb-4 rounded-lg border ${
        alertTypeClasses[alert?.type]
      } shadow-md max-w-md w-full transition-all duration-300 ease-in-out`}
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 mr-3">{alertIcons[alert?.type]}</div>
      <div className="text-sm font-medium">{alert?.message}</div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          setAlert(null)
        }}
        className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 hover:bg-opacity-25 hover:bg-gray-600 focus:ring-2 focus:ring-gray-300`}
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export default Alert