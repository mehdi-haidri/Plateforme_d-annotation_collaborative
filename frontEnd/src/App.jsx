import { BrowserRouter, Outlet } from 'react-router-dom'


import AppRouter from './config/routes'
import { useEffect } from 'react';

function App() {

   useEffect(() => {
       
          document.documentElement.classList.add("dark");
       
      }, []);

  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>
  )
}

export default App
