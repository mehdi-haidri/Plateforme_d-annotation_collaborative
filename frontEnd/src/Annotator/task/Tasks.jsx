import { useEffect, useState } from "react";
import { Link,useOutletContext } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
import roles from "../../config/roles";

const Annotators = () => {
    const { setAlert } = useOutletContext();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const columns = [
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
      setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  };

    useEffect(() => {
      
    fetchAnnotators();
   
  }, []);
    
    

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
        <button
          onClick={() => fetchAnnotators()}
          className="text-blue-700 bg-blue-100 hover:bg-blue-200  font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-200 shadow-sm dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
        >
          Refresh
        </button>
      </div>

      {/* {error && (
        <div
          className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">Error!</span> {error}
        </div>
      )} */}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {isLoading ? (
          <div className="flex items-center justify-center h-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {columns.map((col) => (
                  <th key={col.field} scope="col" className="px-6 py-3" style={{ width: `${col.width}px` }}>
                    {col.label || col.field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{row.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.dataset}</td>
                    <td className="px-6 py-4">{row.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.rowCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.advancement}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.startDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{row.limitDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`${roles.ROLE_ANNOTATOR}/task/${row.id}`}
                        className="text-blue-700 bg-blue-100 hover:bg-blue-200  font-medium rounded-lg text-xs px-4 py-1.5 text-center inline-flex items-center shadow-sm transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 "
                      >
                        START
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white dark:bg-gray-800">
                  <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {rows.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700 dark:text-gray-400">
            Showing <span className="font-medium">{rows.length}</span> tasks
          </div>
          <div className="inline-flex mt-2 xs:mt-0 gap-1">
            <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 shadow-sm transition-all duration-200 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-gray-700">
              Prev
            </button>
            <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 shadow-sm transition-all duration-200 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-gray-700">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Annotators;
