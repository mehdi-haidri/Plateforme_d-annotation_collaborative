import Navbar from './Components/Navbar'
import { Outlet } from 'react-router-dom'
import { AlertContext } from '../App';
import { useContext, useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;
function Layout() {
    const { setAlert } = useContext(AlertContext);
    const [userData, setUserData] = useState()
      const [isLoading, setIsLoading] = useState(false)
    
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
    
    
  return (
      <div className='min-h-screen w-full bg-gray-100 dark:bg-gray-900'>
      <Navbar></Navbar>
      <div className='max-w-[95%] md:max-w-[80%] mx-auto'>
          <Outlet context={{setAlert , userData ,isLoading}}></Outlet>
      </div>
      </div>
  )
}

export default Layout