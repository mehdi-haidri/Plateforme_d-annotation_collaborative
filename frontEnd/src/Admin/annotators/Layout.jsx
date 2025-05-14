import { Outlet, useOutletContext } from 'react-router-dom'


function Layout() {
   const { setAlert } = useOutletContext();
  return (
      <div>
          <Outlet context={{ setAlert }}>
              
          </Outlet>
    </div>
  )
}

export default Layout