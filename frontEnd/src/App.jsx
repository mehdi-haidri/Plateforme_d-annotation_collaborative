import { BrowserRouter, Outlet } from 'react-router-dom'


import AppRouter from './config/routes'

function App() {

  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>
  )
}

export default App
