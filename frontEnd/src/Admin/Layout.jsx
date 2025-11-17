
import { use, useContext, useEffect, useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { Home, Database, Users, LogOut, Sun, Moon, Menu, Settings, CreditCard, LayoutDashboard ,User} from "lucide-react"
import roles from "../config/roles"
import { AlertContext } from "../App"
import LogoutModal from "../Annotator/Components/LogoutModal"
import ThemeToggle from "../Annotator/Components/ThemeToggle"

const API_URL = import.meta.env.VITE_API_URL

function Layout() {
  const [darkMode, setDarkMode] = useState(true)
  const { setAlert } = useContext(AlertContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState(null)
  const location = useLocation()


   const handleThemeChange = (theme) => {
    setDarkMode(theme === "dark")
  }


  const openLogoutModal = () => {
    setIsLogoutModalOpen(true)
  }

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false)
  }

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



  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
        document.body.classList.add('scrollbar-none');
        document.body.classList.add('overflow-auto');
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <>
      {/* Top Navigation */}
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="w-6 h-6" />
              </button>
              <Link to="/" className="flex ms-2 md:me-24">
                <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-3">
                  <Database className="h-6 w-6" />
                </div>
                <span className="self-center text-xl font-semibold sm:text-2xl text-purple-600 whitespace-nowrap dark:text-white">
                  DataAnnotation
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    type="button"
                    className="flex text-sm dark:bg-gray-800 bg-white "
                    aria-expanded={userMenuOpen ? "true" : "false"}
                  >
                    
                    { userData && <div className="flex flex-col justify-center items-end">
                      <div className="text-sm end font-medium text-gray-900 dark:text-white">{userData?.firstName + " " + userData?.lastName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{userData?.email}</div>
                    </div>}
                    <User className="w-8 h-8 ml-3 text-purple-600 rounded-full" />
                  </button>
                </div>
                {userMenuOpen && (
                  <div
                    className="absolute top-10 right-4 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600"
                    id="dropdown-user"
                  >
                    <div className="px-4 py-3" role="none">
                      <p className="text-sm text-gray-900 dark:text-white" role="none">
                        Admin User
                      </p>
                      <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                        admin@example.com
                      </p>
                    </div>
                    <ul className="py-1" role="none">
                      <li>
                        <a
                          href="#"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2" />
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Earnings
                        </a>
                      </li>
                      <li>
                        <button
                         
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                          role="menuitem"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        } bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <div className="flex flex-col items-end">

              <ThemeToggle onToggle={handleThemeChange} />
              </div>
            </li>
            <li>
              <Link
                to={`${roles.ROLE_ADMIN}/`}
                href="#"
                className={`flex items-center p-2 ${location.pathname === `${roles.ROLE_ADMIN}/` ? "dark:bg-gray-700 bg-gray-100" : ""} text-gray-900 dark:text-white rounded-lg  hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <Home className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">Home</span>
              </Link>
            </li>
            <li>
              <Link
                to={`${roles.ROLE_ADMIN}/datasets`}
                className={`flex items-center p-2 ${location.pathname === `${roles.ROLE_ADMIN}/datasets` ? "dark:bg-gray-700 bg-gray-100" : ""} text-gray-900 dark:text-white rounded-lg  hover:bg-gray-100 dark:hover:bg-gray-700 group`}

              >
                <Database className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Datasets</span>
                
              </Link>
            </li>
            <li>
              <Link
                to={`${roles.ROLE_ADMIN}/annotators`}
                className={`flex items-center p-2 ${location.pathname === `${roles.ROLE_ADMIN}/annotators` ? "dark:bg-gray-700 bg-gray-100" : ""} text-gray-900 dark:text-white rounded-lg  hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <Users className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Annotators</span>
                <span className="inline-flex items-center justify-center w-5 h-5 p-1 ms-3 text-xs font-medium text-white bg-purple-600 rounded-full dark:bg-purple-600 dark:text-white">
                  3
                </span>
              </Link>
            </li>
                        <li>
              <Link
                to={`${roles.ROLE_ADMIN}/profile`}
                className={`flex items-center p-2 ${location.pathname === `${roles.ROLE_ADMIN}/profile` ? "dark:bg-gray-700 bg-gray-100" : ""} text-gray-900 dark:text-white rounded-lg  hover:bg-gray-100 dark:hover:bg-gray-700 group`}
              >
                <Settings className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
                
              </Link>
            </li>
            <li>
              <button
                onClick={openLogoutModal}
                className="flex w-full items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <LogOut className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
              </button>
            </li>
            
          </ul>
        </div>
      </aside>
      <LogoutModal isOpen={isLogoutModalOpen} onClose={closeLogoutModal} />

      {/* Main Content */}
      <div className="p-4 sm:ml-64 min-h-screen  bg-gray-50 dark:bg-gray-900 scrollbar-hide scrollbar-none overflow-auto">
        <div className="p-4 relative border border-gray-200 rounded-lg dark:border-gray-700 scrollbar-hide scrollbar-none dark:bg-gray-800 bg-gray-50 mt-14  ">
          <Outlet context={{ setAlert ,userData }} />
        </div>
      </div>

    </>
  )
}

export default Layout
