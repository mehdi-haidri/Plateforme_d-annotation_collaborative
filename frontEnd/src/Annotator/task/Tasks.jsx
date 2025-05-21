import { useEffect, useState } from "react"
import { Link, useOutletContext } from "react-router-dom"
import {
  RefreshCw,
  Loader2,
  CheckSquare,
  Clock,
  Database,
  ChevronLeft,
  ChevronRight,
  Calendar,
  FileText,
  BarChart3,
  AlertTriangle,
} from "lucide-react"
import roles from "../../config/roles"
import { se } from "react-day-picker/locale"

const API_URL = import.meta.env.VITE_API_URL


const Annotators = () => {
    const { setAlert } = useOutletContext()
  const [rows, setRows] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false);


  const columns = [
    {
      field: "id",
      width: 70,
      icon: <Database className="w-4 h-4 mr-1" />,
    },
    {
      field: "dataset",
      width: 130,
      icon: <Database className="w-4 h-4 mr-1" />,
    },
    {
      field: "description",
      width: 130,
      icon: <FileText className="w-4 h-4 mr-1" />,
    },
    {
      field: "rowCount",
      width: 130,
      icon: <BarChart3 className="w-4 h-4 mr-1" />,
    },
    {
      field: "advancement",
      width: 130,
      icon: <BarChart3 className="w-4 h-4 mr-1" />,
    },
    {
      field: "startDate",
      width: 130,
      icon: <Calendar className="w-4 h-4 mr-1" />,
    },
    {
      field: "limitDate",
      width: 130,
      icon: <Calendar className="w-4 h-4 mr-1" />,
    },
    {
      field: "action",
      width: 90,
    },
  ]

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      setIsRefreshing(true)
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
      setIsRefreshing(false)
    }
  };

    useEffect(() => {
      
    fetchTasks();
   
  }, []);
    
    const totalTasks = rows.length
  const completedTasks = rows.filter((task) => task.advancement === 100).length
  const pendingTasks = rows.filter((task) => task.advancement < 100).length

  return (
   <div className="px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-3">
            <CheckSquare className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
        </div>
        <button
          onClick={() => fetchTasks()}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 focus:ring-4 focus:outline-none focus:ring-purple-300 transition-all duration-200 shadow-sm dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50 dark:focus:ring-purple-800 disabled:opacity-70"
        >
          {isRefreshing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-4">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
              <CheckSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mr-4">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{pendingTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Loading tasks...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs font-medium text-gray-500 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                <tr>
                  {columns.map((col) => (
                    <th key={col.field} scope="col" className="px-6 py-4" style={{ width: `${col.width}px` }}>
                      <div className="flex items-center">
                        {col.icon && col.icon}
                        {col.field.charAt(0).toUpperCase() + col.field.slice(1)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {rows.length > 0 ? (
                  rows.map((row) => (
                    <tr
                      key={row.id}
                      className="bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        #{row.id}
                      </td>
                      <td className="px-6 py-4 font-medium">{row.dataset}</td>
                      <td className="px-6 py-4">{row.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{row.rowCount} items</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                            <div
                              className={`h-2.5 rounded-full ${
                                row.advancement === 100
                                  ? "bg-green-600 dark:bg-green-500"
                                  : "bg-purple-600 dark:bg-purple-500"
                              }`}
                              style={{ width: `${row.advancement}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{row.advancement.toFixed(2)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {row.startDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center text-gray-500 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {row.limitDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`${roles.ROLE_ANNOTATOR}/task/${row.id}`}
                          className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            row.advancement === 100
                              ? "text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                              : "text-purple-700 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50"
                          }`}
                        >
                          {row.advancement === 100 ? "REVIEW" : "START"}
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white dark:bg-gray-800">
                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <AlertTriangle className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No tasks found</p>
                        <p className="text-gray-500 dark:text-gray-400">
                          You don't have any assigned tasks at the moment.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {rows.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-700 dark:text-gray-400">
            Showing <span className="font-medium">{rows.length}</span> tasks
          </div>
          <div className="inline-flex gap-1">
            <button className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            <button className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Annotators;
