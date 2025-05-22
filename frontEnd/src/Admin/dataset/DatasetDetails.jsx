"use client"

import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  Database,
  Info,
  Users,
  Calendar,
  FileText,
  Tag,
  BarChart3,
  CheckCircle,
  AlertCircle,
  List,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react"
import roles from "../../config/roles"

const API_URL = import.meta.env.VITE_API_URL

const DatasetDetails = () => {
  const { id } = useParams()
  const [rows, setRows] = useState([])
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showTextCouples, setShowTextCouples] = useState(false)
  const [textCouples, setTextCouples] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Mock data for text couples - this won't affect existing logic
  const mockTextCouples = [
    {
      id: 1,
      text1: "The weather is nice today.",
      text2: "El clima está agradable hoy.",
      annotated: true,
      class: "Weather",
    },
    {
      id: 2,
      text1: "I need to buy groceries.",
      text2: "Necesito comprar víveres.",
      annotated: true,
      class: "Shopping",
    },
    { id: 3, text1: "The train arrives at 3 PM.", text2: "El tren llega a las 3 PM.", annotated: false, class: "" },
    {
      id: 4,
      text1: "She plays tennis every weekend.",
      text2: "Ella juega tenis todos los fines de semana.",
      annotated: true,
      class: "Sports",
    },
    { id: 5, text1: "The book is on the table.", text2: "El libro está sobre la mesa.", annotated: false, class: "" },
    { id: 6, text1: "I have a meeting tomorrow.", text2: "Tengo una reunión mañana.", annotated: true, class: "Work" },
    {
      id: 7,
      text1: "The movie was interesting.",
      text2: "La película fue interesante.",
      annotated: true,
      class: "Entertainment",
    },
    { id: 8, text1: "He is studying medicine.", text2: "Él está estudiando medicina.", annotated: false, class: "" },
    {
      id: 9,
      text1: "We need to finish the project.",
      text2: "Necesitamos terminar el proyecto.",
      annotated: true,
      class: "Work",
    },
    {
      id: 10,
      text1: "The restaurant is closed on Mondays.",
      text2: "El restaurante está cerrado los lunes.",
      annotated: false,
      class: "",
    },
  ]

  const colums = [
    {
      field: "id",
      width: 70,
      icon: <Info className="w-4 h-4 mr-1" />,
    },
    {
      field: "name",
      width: 130,
      icon: <Database className="w-4 h-4 mr-1" />,
    },
    {
      field: "description",
      width: 130,
      icon: <FileText className="w-4 h-4 mr-1" />,
    },
    {
      field: "size",
      width: 130,
      icon: <BarChart3 className="w-4 h-4 mr-1" />,
    },
    {
      field: "classes",
      width: 90,
      icon: <Tag className="w-4 h-4 mr-1" />,
    },
    {
      field: "advancement",
      width: 90,
      icon: <BarChart3 className="w-4 h-4 mr-1" />,
    },
    {
      field: "annotators",
      width: 90,
      icon: <Users className="w-4 h-4 mr-1" />,
    },
    {
      field: "limitDate",
      width: 70,
      icon: <Calendar className="w-4 h-4 mr-1" />,
    },
    {
      field: "status",
      width: 90,
      icon: <CheckCircle className="w-4 h-4 mr-1" />,
    },
  ]

  const fetchTextCoupeles =  async() => {
    try {
        const response = await fetch(`${API_URL}datasets/dataset/${id}/textCouples/${currentPage}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (!response.ok) {
          throw new Error(response)
        }
        const data = await response.json()
        console.log(data)
        setTextCouples(data.data?.textCouples)
        setTotalPages(data.data?.totalPages)
      }catch (error) {
        console.log(error)
      }
    
  }

  const handlPageChange = (page) => {
    setCurrentPage(page)
  }


  const fetchDatasets = async () => {
    setIsLoading(true)
    try {
      let response = await fetch(API_URL + "datasets/" + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      response = await response.json()
      console.log(response)
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
      ])
      setTasks(response.data?.dataset.tasks)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching datasets:", error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDatasets()
  }, [])
  useEffect(() => {
    fetchTextCoupeles()
  }, [currentPage])

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-3">
          <Database className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dataset Details</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Viewing detailed information for dataset #{id}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dataset Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Info className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                Dataset Information
              </h2>

              {/* View Text Couples Button */}
              <button
                onClick={() => setShowTextCouples(!showTextCouples)}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700  focus:outline-none  dark:bg-purple-600 dark:hover:bg-purple-700 "
              >
                <List className="w-4 h-4 mr-1" />
                {showTextCouples ? "Hide Text Couples" : "View Text Couples"}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs font-medium text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                  <tr>
                    {colums.map((col) => (
                      <th key={col.field} scope="col" className="px-6 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          {col?.icon}
                          {col.field.charAt(0).toUpperCase() + col.field.slice(1)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        #{row.id}
                      </td>
                      {colums.map((col, index) => {
                        if (col.field !== "id" && col.field !== "status") {
                          if (col.field === "advancement") {
                            return (
                              <td key={index} className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="mr-2">{((row[col.field] / row["size"]) * 100).toFixed(2)}%</span>
                                  <div className="w-24 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div
                                      className="bg-purple-600 h-2.5 rounded-full dark:bg-purple-500"
                                      style={{ width: `${((row[col.field] / row["size"]) * 100).toFixed(2)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                            )
                          } else if (col.field === "annotators") {
                            return (
                              <td key={index} className="px-6 py-4 whitespace-nowrap">
                                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                  <Users className="w-3 h-3 mr-1" />
                                  {row[col.field]}
                                </div>
                              </td>
                            )
                          } else if (col.field === "limitDate") {
                            return (
                              <td key={index} className="px-6 py-4 whitespace-nowrap">
                                <div className="inline-flex items-center text-gray-500 dark:text-gray-400">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {row[col.field]}
                                </div>
                              </td>
                            )
                          } else {
                            return (
                              <td key={index} className="px-6 py-4">
                                {row[col.field]}
                              </td>
                            )
                          }
                        }
                        return null
                      })}
                      <td className="px-6 py-4">
                        <Link
                          to={`${roles.ROLE_ADMIN}/datasets/add-annotators/${row.id}`}
                          className="font-medium hover:underline"
                        >
                          {row.status ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Annotated
                            </span>
                          ) : (
                            <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800">
                              <Users className="w-3 h-3 mr-1" />
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
          </div>

          {/* Text Couples Section - Only shown when button is clicked */}
          {showTextCouples && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                  Text Couples
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search text..."
                      className="py-1.5 pl-10 pr-4 text-sm border border-gray-300 rounded-lg w-64 outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={() => setShowTextCouples(false)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs font-medium text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Text 1
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Text 2
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Class
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {textCouples.map((couple) => (
                      <tr
                        key={couple.id}
                        className="bg-white border-b dark:bg-gray-900/30 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          #{couple.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs truncate">{couple.text1}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs truncate">{couple.text2}</div>
                        </td>
                        <td className="px-6 py-4">
                          {couple.annotated ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Annotated
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {couple.classe ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                              <Tag className="w-3 h-3 mr-1" />
                              {couple.classe}
                            </span>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{currentPage+ 1}</span> to <span className="font-medium">{totalPages}</span> of{" "}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlPageChange(currentPage - 1)}
                      disabled ={currentPage == 0}
                      className="px-3 py-1 text-sm flex items-center disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                 
                    <button
                     onClick={() => handlPageChange(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                      className="px-3 flex items-center py-1 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                   Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tasks Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
                Dataset Tasks
              </h2>
            </div>

            {tasks.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {tasks.map((task) => (
                  <li key={task.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                          <span className="text-lg font-semibold">{task.id}</span>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Task #{task.id}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">ID: {task.id}</p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center">
                        <div className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">
                          Annotator
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-blue-500 dark:text-blue-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {task.annotatorName}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center">
                        <div className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">
                          Size
                        </div>
                        <div className="flex items-center">
                          <Database className="w-4 h-4 mr-1 text-amber-500 dark:text-amber-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{task.size} Rows</span>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
                            Progress
                          </span>
                          <span className="text-xs font-medium text-gray-900 dark:text-white">
                            {task.advancement.toFixed(2)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div
                            className="bg-purple-600 h-2.5 rounded-full dark:bg-purple-500"
                            style={{ width: `${task.advancement.toFixed(2)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No tasks found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This dataset doesn't have any tasks assigned yet.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DatasetDetails
