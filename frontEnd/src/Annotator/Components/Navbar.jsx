
import {  useState } from "react"
import { Link, useLocation } from "react-router-dom"
import roles from "../../config/roles"
import { Database, LogOut} from "lucide-react"
import LogoutModal from "./LogoutModal"
import ThemeToggle from "./themeToggle"
function Navbar() {
const [menuOpen, setMenuOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true)

   const handleThemeChange = (theme) => {
    setDarkMode(theme === "dark")
  }


  const openLogoutModal = () => {
    setIsLogoutModalOpen(true)
  }

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false)
  }


  return (
    <>
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
             <Link to="/" className="flex ms-2 md:me-24">
                <div className="p-2 bg-purple-100 rounded-lg dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
                  <Database className="h-6 w-6" />
                </div>
                <span className="self-center text-xl font-semibold sm:text-2xl text-blue-600 whitespace-nowrap dark:text-white">
                  DataAnnotation
                </span>
              </Link>
        <div className="flex md:order-2">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
            <span className="sr-only">Search</span>
          </button>
          <div className="relative hidden md:block">
           <ThemeToggle onToggle={handleThemeChange} />
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
        <div className={`items-center justify-between ${menuOpen ? 'flex' : 'hidden'} w-full md:flex md:w-auto md:order-1`} id="navbar-search">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
           <li>
                <Link to={`${roles["ROLE_ANNOTATOR"]}/`} className={`block py-2 px-3 ${location.pathname === `${roles["ROLE_ANNOTATOR"]}/` ? "text-blue-600" : "text-gray-900 dark:text-white"}   rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}>
                Home
              </ Link>
            </li>
            <li>
                <Link to={`${roles["ROLE_ANNOTATOR"]}/tasks`} className={`block py-2 px-3 ${location.pathname === `${roles["ROLE_ANNOTATOR"]}/tasks` ? "text-blue-600" : "text-gray-900 dark:text-white"}   rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700`}>
                  Tasks
              </ Link>
            </li>
            <li>
              <button
                  onClick={openLogoutModal}
                  className="block py-2 px-3 items-center gap-2 flex text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Logout
                  <LogOut className="h-4 w-4 font-semibold" />
                </button>
            </li>
            </ul>
            
        </div>
      </div>
    </nav>
    <LogoutModal isOpen={isLogoutModalOpen} onClose={closeLogoutModal} />
    </>
  );
}

export default Navbar;
