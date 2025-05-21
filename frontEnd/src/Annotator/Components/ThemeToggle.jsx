"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from 'lucide-react'



const ThemeToggle = ({  onToggle }) => {
  const [isDarkMode, setIsDarkMode] = useState(true)


  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark"
    setIsDarkMode(!isDarkMode)
    
    // Update document class for theme
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    
    // Call the onToggle callback if provided
    if (onToggle) {
      onToggle(newTheme)
    }
    
    // Optionally save to localStorage
    localStorage.setItem("theme", newTheme)
  }

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={toggleTheme}
          className="sr-only peer"
          aria-label="Toggle dark mode"
        />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
      </label>
      
      <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    </div>
  )
}

export default ThemeToggle
