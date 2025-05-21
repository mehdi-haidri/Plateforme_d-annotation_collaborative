import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { User, Mail, Loader2, UserCircle, BadgeCheck } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

function Profile() {
  const {  userData: user ,isLoading } = useOutletContext()
 
    const [userData, setUserData] = useState({ firstName: "",
    lastName: "",
    email: "",
          password: ""
      })
    
      useEffect(() => {
          user && setUserData(user)
          console.log(userData)
      }, [user])

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
                    {userData?.firstName} {userData?.lastName}
                  </h2>
                  <div className="flex items-center justify-center mt-1">
                    <BadgeCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-1" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {getRoleDisplayName(userData?.role)}
                    </span>
                  </div>
                </div>
              </div>

              <form >
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
                                                  value={userData?.firstName}
                                                  disabled
                        className={`bg-gray-50 border 
                           "border-red-500" : "border-gray-300 dark:border-gray-600"
                        } text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`}
                        placeholder="Enter your first name"
                      />
                    </div>
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
                                                  disabled
                                                  name="lastName"
                                                  value={userData?.lastName}
                        className={`bg-gray-50 border border-red-500" : "border-gray-300 dark:border-gray-600"
                        } text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`}
                        placeholder="Enter your last name"
                      />
                    </div>
                    
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
                                              value={userData?.email}
                                              disabled
                      className={`bg-gray-50 border "border-red-500" : "border-gray-300 dark:border-gray-600"
                      } text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500`}
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                {/* Password */}
            

                {/* Role (Read-only) */}
                <div className="mb-8">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                  <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300 text-sm rounded-lg p-2.5 flex items-center">
                    <BadgeCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                    {getRoleDisplayName(userData.role)}
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Cannot be changed)</span>
                  </div>
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
