import React, { useState } from 'react'
import Navbar from './Components/Navbar'
import { Outlet } from 'react-router-dom'

function Layout() {
     const [alert, setAlert] = useState(null);
  return (
      <>
      <Navbar></Navbar>
      <div className='max-w-[95%] md:max-w-[80%] mx-auto'>

          <Outlet context={{setAlert}}></Outlet>
      </div>
      </>
  )
}

export default Layout