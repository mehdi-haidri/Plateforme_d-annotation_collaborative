import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AlertContext } from "./App";

const API_URL = import.meta.env.VITE_API_URL;
function Midlware({ children: next, role }) {
  const navigate = useNavigate();
  const {setAlert} = useContext(AlertContext);
  const isTokenValide = async () => {
    console.log(localStorage.getItem('token'));
    let response
    try {
         response = await fetch(`${API_URL}users/isAuth`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        }
        );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      } 
      return false;
    } catch (error) {
      if (response?.status == 401) {
        console.log(response?.status);
        response = await response.json();
        console.log(response?.data?.errorType);
        setAlert({ type: "error", message: "Uanthorized" });
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        return true
      }
      
        setAlert({ type: "error", message: "server Error" });
        
    }
    };

  useEffect(() => {
    console.log(role);
    const checkAuth = async () => {
      if (localStorage.getItem("token") === null || await isTokenValide() || role !== localStorage.getItem("role")) {
        navigate("/login");
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