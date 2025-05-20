

import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, X } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

const LogoutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const modalRef = useRef(null)
  const cancelButtonRef = useRef(null)

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      // Add class to body to prevent scrolling
      document.body.classList.add("overflow-hidden")
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.classList.remove("overflow-hidden")
    }
  }, [isOpen, onClose])

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  // Focus the cancel button when modal opens
  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      cancelButtonRef.current.focus()
    }
  }, [isOpen])

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}users/logout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      localStorage.removeItem("token")
      localStorage.removeItem("role")
      navigate("/login")
    } catch (error) {
      console.error(error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50   overflow-y-auto">
      {/* Dark overlay */}
        <div
  className="fixed inset-0 bg-[#11182691] bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out"
></div>

          <div
               tabIndex={-1}
            className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
          
          >
        <div
          ref={modalRef}
          className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <LogOut className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">Confirm Logout</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to log out? You will need to log in again to access your account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            >
              Logout
            </button>
            <button
              type="button"
              ref={cancelButtonRef}
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogoutModal
