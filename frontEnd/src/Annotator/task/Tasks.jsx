import { useEffect, useState } from "react";
import { Link,useOutletContext } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
import roles from "../../config/roles";

const Annotators = () => {
    const { setAlert } = useOutletContext();
    const [selectedAnnotators, setSelectedAnnotators] = useState([]);
    const [rows, setRows] = useState([]);
  const colums = [
    {
      field: "id",
      width: 70,
      },
    {
      field: "dataset",
      width: 130,
    },
    {
      field: "description",
      width: 130,
    },
    {
      field: "rowCount",
      width: 130,
    },
    {
      field: "advancement",
      width: 130,
    },
    {
      field: "startDate",
      width: 130,
      
    },
    {
      field: "limitDate",
      width: 130,
      },
    {
      field: "action",
      width: 90,
    },
  ];

  const fetchAnnotators = async () => {
    try {
      let response = await fetch(
        API_URL + "annotator/tasks",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
        response = await response.json();
        console.log(response);
      setRows(response?.data?.tasks)
       
    } catch (error) {
      setAlert({ type: "error", message: "server Error" });
      console.error(error);
    }
  };

    useEffect(() => {
      
    fetchAnnotators();
   
  }, []);
    
    

  return (
    <>
      <div>
        <h1 className="m-5 font-bold text-2xl">Tasks</h1>
          </div>
         
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {colums.map((col) => (
                <th key={col.field} scope="col" className="px-6 py-3">
                  {col.field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {row.id}
                </td>
                {colums.map((col, index) => {
                  if (
                      col.field !== "id" &&
                      col.field !== "action"
                  ) {
                    return (
                      <td key={index} className="px-6 py-4">
                        {row[col.field]}
                      </td>
                    );
                  }
                })}
               
                    <td className="px-6 py-4 ">
                  <Link to={`${roles.ROLE_ANNOTATOR}/task/${row.id}`}><button className="btn btn-soft btn-info">START</button></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Annotators;
