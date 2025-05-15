import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const API_URL = import.meta.env.VITE_API_URL;
function Midlware({ children: next, role }) {
    const navigate = useNavigate();
    const isTokenExpired = async () => {
    try {
        const response = await fetch(`${API_URL}users/isAuth`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        }
        );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data?.data.isAuth === "false";
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
      return true;
    }
    };

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem("token") === null || await isTokenExpired()) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

 return (
    <>
        {next}
    </>
  )
}

export default Midlware