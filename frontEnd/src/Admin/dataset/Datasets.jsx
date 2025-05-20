import { useEffect,useState } from 'react'
import Table from '../components/Table'
import { Link } from 'react-router-dom';
import roles from '../../config/roles';
import { Database, Plus, Search, RefreshCw, Filter, Loader2, BarChart3, Check } from 'lucide-react'
import {  Info,  Tag,  CheckCircle ,ArrowLeftRight } from "lucide-react"

const   API_URL = import.meta.env.VITE_API_URL;
function Datasets() {

  const [rows, setRows] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false);

    const columns = [
        {
            field: 'id',
             width: 70,
             icon: <Info className="w-4 h-4 mr-1" />,
          },
          {
            field: 'name',
            width: 130,
            icon: <Database className="w-4 h-4 mr-1" />,
            
          },
          {
            field: 'size',
            width: 130,
            icon: <BarChart3 className="w-4 h-4 mr-1" />,
          },
        {
            field: 'classes',
          width: 90,
            icon: <Tag className="w-4 h-4 mr-1" />,
        },
        {
            field: 'advancement',
          width: 90,
            icon: <BarChart3 className="w-4 h-4 mr-1" />,
        },
        {
            field: 'status',
          width: 90,
            icon: <CheckCircle className="w-4 h-4 mr-1" />,
        },
        {
            field: 'action',
          width: 90,
             icon: <ArrowLeftRight className="w-4 h-4 mr-1" />,
        }
    
    ]

  
      
    
    const fetchData = async () => {
        try {
          let response = await fetch(API_URL+'datasets/datasets', {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
               'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
          });
          if (!response.ok) {
           throw new Error('Network response was not ok');
           }
            response = await response.json();
            let rows = []
            response.data?.datasets.map((dataset) => {
                 rows.push({
                    id: dataset.id,
                    name: dataset.name,
                    size: dataset.size,
                    classes: dataset.numberClasses,
                    advancement: dataset.advancement,
                    status: dataset.annotated,
                  
                 })
                
            })
          console.log(response);
            setRows(rows);
        } catch (error) {
          console.error(error);
        }
      };

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setIsLoading(true)
    await fetchData()
    setIsLoading(false)
    setIsRefreshing(false)
  }

  const filteredRows = rows.filter((row) => row.name.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    fetchData()
  }, [])

  // Calculate some basic stats for the dashboard cards
  const totalDatasets = rows.length
  const annotatedDatasets = rows.filter((row) => row.status).length
  const totalClasses = rows.reduce((sum, row) => sum + row.classes, 0)

   
  return (
      <div className="container mx-auto px-4 py-8">
      {/* Header with title and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Database className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="font-bold text-2xl text-gray-800 dark:text-white">Datasets</h1>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none  transition-colors"
        >
          <Link to={`${roles.ROLE_ADMIN}/datasets/addDataset`} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Dataset
          </Link>
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Datasets</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalDatasets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Annotated</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {annotatedDatasets} / {totalDatasets}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Classes</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalClasses}</p>
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
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
            placeholder="Search datasets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {isRefreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh
        </button>

        <button className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>

      {/* Loading, error, or table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading datasets...</p>
        </div>
      )  : (
        <Table rows={filteredRows} colums={columns} />
      )}
    </div>
  )
}

export default Datasets