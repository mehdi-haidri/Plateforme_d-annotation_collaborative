"use client"

import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { User, Mail, Lock, Save, Loader2, UserCircle, BadgeCheck, AlertCircle, Eye, EyeOff } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

function Profile() {
  const { setAlert } = useOutletContext()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  })
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  // Fetch user data
  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}users/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }

      const data = await response.json()

      console.log(data)
      setUserData({
        firstName: data.data?.user?.firstName || "John",
        lastName: data.data?.user?.lastName || "Doe",
        email: data.data?.user?.email || "john.doe@example.com",
        password: "",
        role: data?.data?.role?.name || "ROLE_ANNOTATOR",
      })
    } catch (error) {
      console.error("Error fetching user data:", error)
      setAlert({
        type: "error",
        message: "Failed to load user profile. Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData({
      ...userData,
      [name]: value,
    })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    }

    let isValid = true

    if (!userData.firstName.trim()) {
      newErrors.firstName = "First name is required"
      isValid = false
    }

    if (!userData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
      isValid = false
    }

    if (!userData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (userData.password && userData.password.length < 4) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSaving(true)
    try {
      // Prepare data for API - only include password if it was changed
      const updateData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
         password: userData.password
      }

      const response = await fetch(`${API_URL}users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updateData),
      })
        console.log(response);

        if (!response.ok) {
          if (response.status == 400 ) {
           const response2 = await response.json()
           response2.data?.errorType == "validation" ? setErrors(response2.data.errors) : "";
              console.log(response2.data.errors);
              
          }else throw new Error("Failed to update profile")
      }

      // Clear password field after successful update
      setUserData({
        ...userData,
        password: "",
      })

      response.ok && setAlert({
        type: "success",
        message: "Profile updated successfully!",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      setAlert({
        type: "error",
        message: "Failed to update profile. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "Administrator"
      case "ROLE_ANNOTATOR":
        return "Annotator"
      default:
        return role
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <User className="h-6 w-6 text-purple-600 mr-2" />
          User Profile
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center  h-64">
            <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">Loading profile...</span>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              {/* User Avatar */}
              <div className="flex flex-col items-center mb-8">
                <div className="w-32 h-32 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                  <UserCircle className="w-24 h-24" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <div className="flex items-center justify-center mt-1">
                    <BadgeCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-1" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {getRoleDisplayName(userData.role)}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleInputChange}
                        className={`bg-gray-50 border ${
                          errors.firstName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        } text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`}
                        placeholder="Enter your first name"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleInputChange}
                        className={`bg-gray-50 border ${
                          errors.lastName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        } text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`}
                        placeholder="Enter your last name"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className={`bg-gray-50 border ${
                        errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      } text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`}
                      placeholder="name@company.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-6">
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password (leave blank to keep current)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={userData.password}
                      onChange={handleInputChange}
                      className={`bg-gray-50 border ${
                        errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                      } text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 pr-10 p-2.5 dark:bg-gray-700 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Enter a new password only if you want to change it.
                  </p>
                </div>

                {/* Role (Read-only) */}
                <div className="mb-8">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                  <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 text-sm rounded-lg p-2.5 flex items-center">
                    <BadgeCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                    {getRoleDisplayName(userData.role)}
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Cannot be changed)</span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-70 disabled:cursor-not-allowed transition-colors dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
