import { BrowserRouter } from 'react-router-dom'

import { createContext, use } from "react";  
import AppRouter from './config/routes'
import { useEffect, useState } from 'react';
import Alert from './Admin/components/Alert';
export const AlertContext = createContext(null);
function App() {
  const [alert, setAlert] = useState(null);

   useEffect(() => {
       
          document.documentElement.classList.add("dark");
       
   }, []);
  
  useEffect(() => {
    console.log(alert);
  }, [alert]);

  return (
    <BrowserRouter>
      {alert && <Alert alert={alert} setAlert={setAlert}></Alert>}
      <AlertContext.Provider value={{ setAlert }}>
        <AppRouter />
        </AlertContext.Provider>
    </BrowserRouter>
  )
}

export default App
