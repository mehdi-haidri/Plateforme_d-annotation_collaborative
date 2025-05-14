import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";


const Annotators = () => {
    const { setAlert } = useOutletContext();
  const Navigate = useNavigate();
  const [selectedAnnotators, setSelectedAnnotators] = useState([]);
    const [rows, setRows] = useState([]);
   
  const colums = [
    {
      field: "id",
      width: 70,
    },
    {
      field: "firstName",
      width: 130,
    },
    {
      field: "lastame",
      width: 130,
    },
    {
      field: "status",
      width: 90,
    },
    {
      field: "action",
      width: 90,
    },
  ];
  const fetchAnnotators = async () => {
    try {
      let response = await fetch(
        "http://localhost:8080/app/v1/users/annotators"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      response = await response.json();
      setRows(
        response.data?.annotators.map((annotator) => {
          return {
            id: annotator.id,
            firstName: annotator.firstName,
            lastName: annotator.lastName,
            status: annotator.status,
          };
        })
      );
    } catch (error) {
      setAlert({ type: "error", message: "Annotators not found" });
      console.error(error);
    }
  };

    useEffect(() => {
      
    fetchAnnotators();
   
  }, []);
    
    

  return (
    <>
      <div>
        <h1 className="m-5 font-bold text-2xl">Annotators</h1>
          </div>
          <div>
             
        <button type="button" className="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          <Link to="/annotators/addAnnotator" >Add + </Link></button>
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
                    col.field !== "status" &&
                    col.field !== "action" &&
                    col.field !== "id"
                  ) {
                    return (
                      <td key={index} className="px-6 py-4">
                        {row[col.field]}
                      </td>
                    );
                  }
                })}
                <td className="px-6 py-2 ">
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    {row.status ? (
                      "inactive"
                    ) : (
                      <button className="btn btn-soft btn-success">
                        ACTIVE
                      </button>
                    )}
                  </a>
                </td>
                    <td className="px-6 py-4 flex gap-2">
                  <Link to={`/annotators/updateAnnotator/${row.id}`}><button className="btn btn-soft btn-info">Modify</button></Link>
                  <button className="btn btn-soft btn-error">Delete</button>
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
