import Navbar from './Components/Navbar'
import { Outlet } from 'react-router-dom'
import { AlertContext } from '../App';
import { useContext } from 'react';

function Layout() {
       const {setAlert} = useContext(AlertContext);
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