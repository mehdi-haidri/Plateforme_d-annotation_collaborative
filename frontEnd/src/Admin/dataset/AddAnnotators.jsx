import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import { Calendar, Users, Check, Loader2, ChevronDown, Info, Filter, Search, CheckSquare, Square } from "lucide-react"
import {   CheckCircle ,ArrowLeftRight  , User ,AtSign} from "lucide-react"
import roles from "../../config/roles";

const API_URL = import.meta.env.VITE_API_URL;

const AddAnnotators = () => {
  const { setAlert } = useOutletContext()
  const { id } = useParams()
  const Navigate = useNavigate()
  const [selectedAnnotators, setSelectedAnnotators] = useState([])
  const [rows, setRows] = useState([])
  const [date, setDate] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectAll, setSelectAll] = useState(false)
   
  const colums = [
    {
      field: "id",
      width: 70,
      icon: <Info className="w-4 h-4 mr-1" />,
    },
    {
      field: "name",
      width: 130,
      icon: <User className="w-4 h-4 mr-1" />,
    },
    {
      field: "email",
      width: 130,
      icon: <AtSign className="w-4 h-4 mr-1" />,
    },
    {
      field: "status",
      width: 90,
      icon: <CheckCircle className="w-4 h-4 mr-1" />,
    },
    {
      field: "action",
      width: 90,
      icon: <ArrowLeftRight className="w-4 h-4 mr-1" />,
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
      console.log(response);
      setRows(
        response.data?.annotators.map((annotator) => {
          return {
            id: annotator.id,
            name: annotator.firstName + " " + annotator.lastName,
            email: annotator.email,
            status: annotator.state,
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

  console.log(rows)
    
  const handleSubmit = async () => {
        setIsLoading(true);
        console.log(selectedAnnotators ,datasetId , date?.toISOString() )
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
           Navigate(`${roles.ROLE_ADMIN}/datasets`);
          } catch (error) {
            console.error(error);
          }
        setIsLoading(false);
    }
const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAnnotators([])
    } else {
      setSelectedAnnotators(filteredRows.map((row) => row.id))
    }
    setSelectAll(!selectAll)
  }

  const toggleAnnotator = (id) => {
    if (selectedAnnotators.includes(id)) {
      setSelectedAnnotators(selectedAnnotators.filter((a) => a !== id))
    } else {
      setSelectedAnnotators([...selectedAnnotators, id])
    }
  }

  // Filter rows based on search term

  const filteredRows = rows.filter(
    (row) =>
      (row.name?.toLowerCase().includes(searchTerm.toLowerCase()) )
  )

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-purple-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assign Annotators</h1>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
          <Info className="h-4 w-4 mr-2 text-blue-500" />
          <span>
            Dataset ID: <span className="font-medium text-gray-900 dark:text-white">#{id}</span>
          </span>
        </div>
      </div>

      {/* Date Picker Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-purple-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Set Deadline</h2>
          </div>
          <div className="relative">
            <button  popoverTarget="rdp-popover" className=" my-4 btn  input focus:outline-none  inline-flex items-center justify-between w-full sm:w-48 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50  dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600" style={{ anchorName: "--rdp" } }>
                      {date ? date.toLocaleDateString() : "Select deadline date"}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </button> 
           
          

                <div popover="auto" id="rdp-popover" className="dropdown  bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700" style={{ positionAnchor: "--rdp" }}>
                      <DayPicker
                  className="react-day-picker"
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  modifiersStyles={{
                    selected: {
                      backgroundColor: "#9333ea",
                      color: "white",
                    },
                  }}
                />
                    </div>
                
     
        
          </div>
          {date && (
            <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded-full dark:bg-purple-900/30 dark:text-purple-400">
              <Check className="w-4 h-4 mr-1" />
              Deadline set: {date.toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2.5"
            placeholder="Search annotators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>

      {/* Selection summary */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">{selectedAnnotators.length}</span> of{" "}
          <span className="font-medium">{rows.length}</span> annotators selected
        </div>
        <button
          onClick={handleSelectAll}
          className="inline-flex items-center text-sm font-medium text-purple-700 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
        >
          {selectAll ? (
            <>
              <CheckSquare className="w-4 h-4 mr-1" />
              Deselect All
            </>
          ) : (
            <>
              <Square className="w-4 h-4 mr-1" />
              Select All
            </>
          )}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700 overflow-hidden mb-6">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs font-medium text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                {colums.map((col) => (
                  <th key={col.field} scope="col" className="px-6 py-4" >
                      <div className="flex items-center">
                          {col?.icon}
                          {col.field.charAt(0).toUpperCase() + col.field.slice(1)}
                  </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">#{row.id}</td>
                  <td className="px-6 py-4">{row.name}</td>
                  <td className="px-6 py-4">{row.email}</td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-400">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      Active
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAnnotators.includes(row.id)}
                        onChange={() => toggleAnnotator(row.id)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => Navigate("/datasets")}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || selectedAnnotators.length === 0 || !date}
          className={`inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors ${
            isLoading || selectedAnnotators.length === 0 || !date ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Assigning...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Assign Annotators
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddAnnotators;
