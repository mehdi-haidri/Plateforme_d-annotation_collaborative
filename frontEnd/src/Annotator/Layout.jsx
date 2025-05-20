import Navbar from './Components/Navbar'
import { Outlet } from 'react-router-dom'
import { AlertContext } from '../App';
import { useContext } from 'react';

function Layout() {
       const {setAlert} = useContext(AlertContext);
  return (
      <div className='min-h-screen w-full bg-gray-100 dark:bg-gray-900'>
      <Navbar></Navbar>
      <div className='max-w-[95%] md:max-w-[80%] mx-auto'>
          <Outlet context={{setAlert}}></Outlet>
      </div>
      </div>
  )
}

export default Layout