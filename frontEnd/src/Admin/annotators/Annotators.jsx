import { useEffect, useState } from "react";
import { Link,  useOutletContext } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
import roles from "../../config/roles";
import {
  Pencil,
  XCircle,
  CheckCircle,
  Users,
  Search,
  RefreshCw,
  Loader2,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  UserPlus,
  MoreHorizontal,
  Download,
  Upload,
} from "lucide-react"
import UpdateAnnotatorModal from "./UpdateAnnotator";

const Annotators = () => {
   const { setAlert } = useOutletContext()
  const [rows, setRows] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all") // "all", "active", "inactive"
   const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAnnotatorId, setSelectedAnnotatorId] = useState(null)
   
  const columns = [
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
    setIsLoading(true)
    try {
      let response = await fetch(
        API_URL + "users/annotators",
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
      setRows(
        response.data?.annotators.map((annotator) => {
          return {
            id: annotator.id,
            firstName: annotator.firstName,
            lastName: annotator.lastName,
            status: annotator.state,
          };
        })
      );
    } catch (error) {
      setAlert({ type: "error", message: "Annotators not found" });
      console.error(error);
    }finally{ 
      setIsLoading(false)
    }
  };

  const toggleActive = async(id)=>{
    try {
      let response = await fetch(
        API_URL + "users/annotators/toggleActivation/"+id,
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
      fetchAnnotators();
    } catch (error) {
      setAlert({ type: "error", message: "Annotators not found" });
      console.error(error);
    }
  }

    useEffect(() => {

    fetchAnnotators();
   
  }, []);
    
     const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchAnnotators()
    setIsRefreshing(false)
  }

    const filteredRows = rows.filter((row) => {
    const matchesSearch =
      searchTerm === "" ||
      row.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.lastName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "active" && row.status) ||
      (activeFilter === "inactive" && !row.status)

    return matchesSearch && matchesFilter
  })

   const openEditModal = (id) => {
    setSelectedAnnotatorId(id)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedAnnotatorId(null)
    // Refresh the annotators list after modal is closed
    fetchAnnotators()
  }
  // Stats for dashboard cards
  const totalAnnotators = rows.length
  const activeAnnotators = rows.filter((row) => row.status).length
  const inactiveAnnotators = rows.filter((row) => !row.status).length

  return (
     <div className="px-4 py-6">
      {/* Header with title and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-purple-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Annotators</h1>
        </div>
        <Link
          to={`${roles.ROLE_ADMIN}/annotators/addAnnotator`}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Annotator
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Annotators</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalAnnotators}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{activeAnnotators}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mr-4">
              <UserX className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Inactive</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{inactiveAnnotators}</p>
            </div>
          </div>
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

        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeFilter === "all"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                : "bg-white text-gray-700 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("active")}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeFilter === "active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-white text-gray-700 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveFilter("inactive")}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeFilter === "inactive"
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                : "bg-white text-gray-700 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            }`}
          >
            Inactive
          </button>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {isRefreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
        <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Loading annotators...</p>
            </div>
          </div>
        ) : filteredRows.length > 0 ? (
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs font-medium text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                <tr>
                  {columns.map((col) => (
                    <th key={col.field} scope="col" className="px-6 py-4" style={{ width: `${col.width}px` }}>
                      {col.label || col.field}
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
                    <td className="px-6 py-4">{row.firstName}</td>
                    <td className="px-6 py-4">{row.lastName}</td>
                    <td className="px-6 py-4">
                      {row.status ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-400">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          Active
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full dark:bg-red-900/30 dark:text-red-400">
                          <span className="relative flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                          Inactive
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(row.id)}
                          // to={`${roles.ROLE_ADMIN}/annotators/updateAnnotator/${row.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50"
                        >
                          <Pencil className="w-3 h-3" />
                          Edit
                        </button>
                        {row.status ? (
                          <button
                            onClick={() => toggleActive(row.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                          >
                            <XCircle className="w-3 h-3" />
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleActive(row.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Activate
                          </button>
                        )}
                        <button className="inline-flex items-center justify-center w-8 h-8 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-700 transition-colors dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <AlertTriangle size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No annotators found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? "Try adjusting your search or filter criteria." : "Add an annotator to get started."}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("")
                  setActiveFilter("all")
                }}
                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredRows.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-700 dark:text-gray-400">
            Showing <span className="font-medium">{filteredRows.length}</span> of{" "}
            <span className="font-medium">{rows.length}</span> annotators
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

      {/* Update Annotator Modal */}
      <UpdateAnnotatorModal isOpen={isModalOpen} onClose={closeModal} annotatorId={selectedAnnotatorId} />
    </div>
  );
};

export default Annotators;
