import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const DatasetDetails = () => {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [tasks, setTasks] = useState([]);
  const colums = [
    {
      field: "id",
      width: 70,
    },
    {
      field: "name",
      width: 130,
    },
    {
      field: "description",
      width: 130,
    },
    {
      field: "size",
      width: 130,
    },
    {
      field: "classes",
      width: 90,
    },
    {
      field: "advancement",
      width: 90,
    },
    {
      field: "annotators",
      width: 90,
    },
    {
      field: "limitDate",
      width: 70,
    },
    {
      field: "status",
      width: 90,
    },
  ];

  const fetchDatasets = async () => {
    try {
      let response = await fetch(API_URL + "datasets/" + id, 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      response = await response.json();
      console.log(response);
      setRows([
        {
          id: response.data?.dataset.id,
          name: response.data?.dataset.name,
          description: response.data?.dataset.description,
          size: response.data?.dataset.size,
          classes: response.data?.dataset.classes.join(" , "),
          advancement: response.data?.dataset.advancement,
          status: response.data?.dataset.annotators.length > 0 ? true : false,
          annotators: response.data?.dataset.annotators.length,
          limitDate: response.data?.dataset.limitDate,
        },
      ]);
      setTasks(response.data?.dataset.tasks);
    } catch (error) {
      console.error("Error fetching datasets:", error);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);
    return (
      <>
          <div>
              <h1 className='m-5 font-bold text-2xl'>Dataset Details</h1>
      </div>
    <div className="grid grid-rows-2 gap-4">
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
                  if (col.field !== "id" && col.field !== "status") {
                    return (
                      <td key={index} className="px-6 py-4">
                        {row[col.field]}
                      </td>
                    );
                  }
                })}
                <td className="px-6 py-2 ">
                  <Link
                    to={`/datasets/add-annotators/${row.id}`}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    {row.status ? (
                      "annotated"
                    ) : (
                      <button className="btn btn-soft btn-warning">
                        Add annotators
                      </button>
                    )}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="list bg-base-100 rounded-box shadow-md">
        <li className="p-4 pb-2 text-md tracking-wide">
          Dataset Tasks
        </li>
        {tasks.map((task) => (
          <li key={task.id} className="list-row grid grid-cols-3">
            <div className="text-2xl font-thin opacity-30 tabular-nums gap-2">
              {" "}
                    Task 0{task.id}{" "}
            </div>

            <div className="content-center">
                    
              <div className="text-xs uppercase font-semibold opacity-60">
                {task.annotatorName}
                    </div>
               
                </div>

                <div className="content-center">
                    <div className="text-xs uppercase font-semibold opacity-60">
                        {task.size} Row
                    </div>
                   
                </div>
                <div className="">
                    <div className="text-xs uppercase font-semibold opacity-60">
                        {task.advancement}%
                    </div>
                    <progress className="progress progress-accent w-56 m-auto" value={task.advancement} max="100"></progress>
                </div>
                
               
                    
               
          </li>
        ))}
      </ul>
            </div>
            </>
  );
};

export default DatasetDetails;
