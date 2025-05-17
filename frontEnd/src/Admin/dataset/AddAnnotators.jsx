import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import { se } from "react-day-picker/locale";

const API_URL = import.meta.env.VITE_API_URL;

const AddAnnotators = () => {
  const { setAlert } = useOutletContext();
  const { id } = useParams();
  const Navigate = useNavigate();
  const [selectedAnnotators, setSelectedAnnotators] = useState([]);
    const [rows, setRows] = useState([]);
  const [date, setDate] = useState()
  const [isLoading , setIsLoading] = useState(false);
   
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
        API_URL+"users/annotators/true", {
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
    console.log(id);
  }, []);
    
  const handleSubmit = async () => {
        setIsLoading(true);
        
        try {
            let response = await fetch(API_URL+'datasets/addAnnotators', {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ datasetId: id, annotators: selectedAnnotators, datelimit: date.toISOString().split('T')[0]}),
            })
          if (!response.ok) {
              console.log(response);
              throw new Error('Network response was not ok');
              }
              response = await response.json();
            
            setAlert({ type: "success", message: "Annotators created successfully" });
           Navigate(`/datasets`);
          } catch (error) {
            console.error(error);
          }
        setIsLoading(false);
    }

  return (
    <>
      <div>
        <h1 className="m-5 font-bold text-2xl">Active Annotators</h1>
      </div>
          <>
        <p className="input-label inline-block mx-2">limit date : </p>
         <button popoverTarget="rdp-popover" className=" my-4 input focus:outline-none" style={{ anchorName: "--rdp" } }>
        {date ? date.toLocaleDateString() : "Pick a date"}
      </button>
      <div popover="auto" id="rdp-popover" className="dropdown" style={{ positionAnchor: "--rdp" }}>
        <DayPicker className="react-day-picker" mode="single" selected={date} onSelect={setDate} />
      </div>
    </>
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
                <td className="px-6 py-2 text-right">
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
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAnnotators([...selectedAnnotators, row.id]);
                      } else {
                        setSelectedAnnotators(
                          selectedAnnotators.filter((a) => a !== row.id)
                        );
                      }
                    }}
                    className="toggle border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => handleSubmit()}
        className="text-white my-4 bg-blue-700 hover:bg-blue-800   font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
                          {isLoading ? <span className="loading loading-dots loading-md"></span>: "Save"}

      </button>
    </>
  );
};

export default AddAnnotators;
