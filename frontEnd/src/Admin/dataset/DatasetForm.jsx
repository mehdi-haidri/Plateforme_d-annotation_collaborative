

import { useState, useRef, useEffect } from "react"
import { Calendar, Database, FileUp, Plus, X } from "lucide-react"
import { useOutletContext } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
import { useNavigate } from "react-router-dom";

// This would be replaced with your actual roles configuration
const roles = {
  ROLE_ADMIN: "/admin",
}




// Simple custom date picker component that doesn't rely on external CSS
function SimpleDatePicker({
  selectedDate,
  onDateSelect,
  onClose,
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate))

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const handleDateClick = (day) => {
    onDateSelect(new Date(year, month, day))
    onClose()
  }

  // Create calendar grid
  const days = []
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const isCurrentDate = (day) => {
    const today = new Date()
    return day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="font-medium">
          {monthNames[month]} {year}
        </div>
        <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div key={index} className="aspect-square">
            {day ? (
              <button
                onClick={() => handleDateClick(day)}
                className={`w-full h-full flex items-center justify-center text-sm rounded-full
                  ${
                    isCurrentDate(day)
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                {day}
              </button>
            ) : (
              <div className="w-full h-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DatasetForm() {
  const requestError = useRef(null)
  const [date, setDate] = useState(new Date())
  const { setAlert } = useOutletContext();
  const Navigate = useNavigate();
  const [file, setFile] = useState(null)
  const [annotators, setAnnotators] = useState([])
  const [selectedAnnotators, setSelectedAnnotators] = useState([])
  const inputRef = useRef(null)
  const [classes, setClasses] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [validation, setValidation] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)

  // Mock API URL for demonstration


  // Mock annotators data for demonstration
 

  useEffect(() => {
    fetchAnnotators()
  }, [])

    const fetchAnnotators = async () => {
    try {
      let response = await fetch(
        API_URL + "users/annotators/true", {
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
      setAnnotators(response.data?.annotators.map((annotator) => {
        return { id: annotator.id, name: annotator.firstName + " " + annotator.lastName }
      }));
    } catch (error) {
      setAlert({ type: "error", message: "Annotators not found" });
      console.error(error);
    }
  };

  
      
    
   
  

  const handleSubmit = async () => {
    // Reset validation and success message
    setValidation({})
    setSuccessMessage(null)
    setIsLoading(true)

    // Basic form validation
    const errors  = {}
    if (!name.trim()) errors.name = "Name is required"
    if (!description.trim()) errors.description = "Description is required"
    if (!classes.trim() || classes.split(";").length <= 1)
      errors.classes = "At least two classes are required (separated by ;)"
    if (!file) errors.file = "File is required"
    // if (selectedAnnotators.length === 0) {
    //   setAlert({ type: "error", message: "Please select at least one annotator" })
    //   setIsLoading(false)
    //   return
    // }

    if (Object.keys(errors).length > 0) {
      setValidation(errors)
      setIsLoading(false)
      return
    }

      try {
      console.log(classes.split(";").length > 1 ? classes.split(";") : "");
      const formData = new FormData();
      file && formData.append("file", file);
      formData.append("name", name);
      formData.append("annotators", JSON.stringify(selectedAnnotators.map((annotator) => annotator.id)));
      classes.split(";").length > 1 && formData.append("classes",JSON.stringify(classes.split(";")));
      formData.append("description", description);
      formData.append("datelimit", date?.toISOString().split('T')[0]);
      let response = await fetch(API_URL + 'datasets/addDataset', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      body: formData,
      })
      
      if (!response.ok || response?.error === true) {
        requestError.current = response
        throw new Error("Network response was not ok");
      }
      response = await response.json();
      console.log(response);
      setAlert({ type: "success", message: "Dataset created successfully" });
      Navigate(roles.ROLE_ADMIN+'/datasets');
     
      } catch (error) {
        console.log(error);
      if (requestError.current.satus == 500) {
        setAlert({ type: "error", message: "server Error" });
      } else if (requestError.current.status == 400 ) {
        const response = await requestError.current.json()
        response.data?.errorType == "validation" ? setValidation(response.data.errors) : setAlert({ type: "error", message: "Bad request" });
        console.log(response.data.errors);
      }
    }finally{
      setIsLoading(false)
    }
  }

  const handleSelectedAnnotator = (annotator) => {
    setSelectedAnnotators([...selectedAnnotators, annotator])
    setAnnotators(annotators.filter((a) => a.id !== annotator.id))
  }

  const handleUnSelectedAnnotator = (annotator) => {
    setAnnotators([...annotators, annotator])
    setSelectedAnnotators(selectedAnnotators.filter((a) => a.id !== annotator.id))
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center">
          <Database className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Dataset</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a new dataset for annotation</p>
      </div>

      {successMessage && (
        <div
          className="p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <span className="font-medium">Success!</span> {successMessage}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Form fields */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Dataset Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    id="name"
                    placeholder="Enter dataset name"
                    className={`block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border ${
                      validation?.name ? "border-red-500" : "border-gray-300"
                    } focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  />
                  {validation?.name && <p className="mt-1 text-sm text-red-600 dark:text-red-500">{validation.name}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="description"
                    rows={3}
                    placeholder="Enter dataset description"
                    className={`block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border ${
                      validation?.description ? "border-red-500" : "border-gray-300"
                    } focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  />
                  {validation?.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">{validation.description}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="classes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Classes
                  </label>
                  <input
                    value={classes}
                    onChange={(e) => setClasses(e.target.value)}
                    type="text"
                    id="classes"
                    placeholder="Enter classes separated by semicolons (e.g. Class1;Class2;Class3)"
                    className={`block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border ${
                      validation?.classes ? "border-red-500" : "border-gray-300"
                    } focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  />
                  {validation?.classes ? (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">{validation.classes}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Separate classes with semicolons (;)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dataset File</label>
                  <div className="flex items-center">
                    <button
                      onClick={() => inputRef.current?.click()}
                      type="button"
                      className="text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center shadow-sm transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 dark:focus:ring-blue-800"
                    >
                      <FileUp className="w-4 h-4 mr-2" />
                      Choose File
                      <input
                        ref={inputRef}
                        onChange={(e) => e.target.files && setFile(e.target.files[0])}
                        type="file"
                        className="hidden"
                        accept=".csv,.xlsx,.xls,.txt,.json"
                      />
                    </button>
                    {file && (
                      <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                    )}
                  </div>
                  {validation?.file && <p className="mt-1 text-sm text-red-600 dark:text-red-500">{validation.file}</p>}
                </div>

                {selectedAnnotators.length > 0 && (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Deadline Date
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className="text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center shadow-sm transition-all duration-200 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-gray-700"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        {date ? date.toLocaleDateString() : "Select a date"}
                      </button>
                      {showDatePicker && (
                        <div className="absolute z-10 mt-1">
                          <SimpleDatePicker
                            selectedDate={date}
                            onDateSelect={setDate}
                            onClose={() => setShowDatePicker(false)}
                          />
                        
                        </div>
                      )}
                       {validation?.datelimit && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">{validation.datelimit}</p>
                  )}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Right column - Annotators selection */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">Selected Annotators</label>
                  <div className="relative">
                    <button
                      type="button"
                      className="text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-4 py-2 inline-flex items-center shadow-sm transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 dark:focus:ring-blue-800"
                      id="annotator-dropdown-button"
                      onClick={() => {
                        const dropdown = document.getElementById("annotator-dropdown")
                        if (dropdown) {
                          dropdown.classList.toggle("hidden")
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Annotator
                    </button>
                    <div
                      id="annotator-dropdown"
                      className="hidden absolute right-0 z-10 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700"
                    >
                      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                        {annotators.length > 0 ? (
                          annotators.map((annotator) => (
                            <li key={annotator.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  handleSelectedAnnotator(annotator)
                                  const dropdown = document.getElementById("annotator-dropdown")
                                  if (dropdown) {
                                    dropdown.classList.add("hidden")
                                  }
                                }}
                                className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                              >
                                {annotator.name}
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-2 text-gray-500 dark:text-gray-400">No annotators available</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
                  {selectedAnnotators.length > 0 ? (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {selectedAnnotators.map((annotator) => (
                        <li
                          key={annotator.id}
                          className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                              #{annotator.id}
                            </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{annotator.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUnSelectedAnnotator(annotator)}
                            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                          >
                            <X className="w-5 h-5" />
                            <span className="sr-only">Remove</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                      No annotators selected. Please add at least one annotator.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              className="text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 shadow-sm transition-all duration-200 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              type="button"
              disabled={isLoading}
              className="text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-2.5 shadow-sm transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 me-3 text-blue-700 animate-spin dark:text-blue-300"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                  Creating Dataset...
                </div>
              ) : (
                "Create Dataset"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
