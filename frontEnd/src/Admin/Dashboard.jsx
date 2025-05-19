
import { useState, useEffect } from "react"
import {
  Users,
  Database,
  CheckSquare,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calendar,
  Search,
  MoreHorizontal,
  RefreshCw,
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  PieChart,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"


const API_URL = import.meta.env.VITE_API_URL
// Mock data for the dashboard
const MOCK_STATS = {
  totalUsers: 128,
  totalDatasets: 45,
  totalAnnotators: 32,
  totalTasks: 156,
  activeUsers: 87,
  completedTasks: 98,
  pendingTasks: 58,
}

// Mock data for active users
const MOCK_ACTIVE_USERS = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "online",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Annotator",

    status: "online",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.j@example.com",
    role: "Annotator",

    status: "online",
  },
  {
    id: 4,
    name: "Emily Williams",
    email: "emily.w@example.com",
    role: "Annotator",

    status: "online",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.b@example.com",
    role: "Admin",

    status: "online",
  },
  {
    id: 6,
    name: "Sarah Miller",
    email: "sarah.m@example.com",
    role: "Annotator",

    status: "online",
  },
  {
    id: 7,
    name: "Robert Wilson",
    email: "robert.w@example.com",
    role: "Annotator",
    status: "away",
  },
  {
    id: 8,
    name: "Jennifer Taylor",
    email: "jennifer.t@example.com",
    role: "Annotator",

    status: "away",
  },
]

// Mock data for login activity over the last week

// Mock data for user distribution
const MOCK_USER_DISTRIBUTION = [
    { name: "Completd ", value: 12 },
    { name: "Pending", value: 32 },
    { name: "Not Assigned", value: 8 },
]
const MOCK_LOGIN_DATA = [
  { day: "Mon", logins: 42 },
  { day: "Tue", logins: 38 },
  { day: "Wed", logins: 55 },
  { day: "Thu", logins: 47 },
  { day: "Fri", logins: 60 },
  { day: "Sat", logins: 32 },
  { day: "Sun", logins: 28 },
]

// Colors for the pie chart
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"]

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState(MOCK_STATS)
  const [activeUsers, setActiveUsers] = useState(MOCK_ACTIVE_USERS)
  const [loginData, setLoginData] = useState(MOCK_LOGIN_DATA)
  const [userDistribution, setUserDistribution] = useState(MOCK_USER_DISTRIBUTION)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshData, setRefreshData] = useState("")

  // Simulate data loading
  useEffect(() => {
      fetchForLineChart()
      fetchData()
  }, [])
    
 const fetchForLineChart = async () => {
    try {
          
            const response = await fetch(`${API_URL}analytics/logins/last7days`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            const labels = Object.keys(data);
            const values = Object.values(data);
            setLoginData(labels.map((day, index) => ({ day, logins: values[index] })));
            setIsLoading(false);
        } catch (error) {
            console.error(
                "An error occurred while fetching login data:",
            );
        }
    }
    const fetchData = async () => {
     const date = new Date();
const formattedTime = date.toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});
      setRefreshData(formattedTime)
    try {
      const response = await fetch(`${API_URL}analytics/dashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
        const data = await response.json();
        console.log(data.userDistribution);
        setUserDistribution(data.userDistribution);
        setActiveUsers(data.activeUsers);
        setStats(data.stats);
    } catch (error) {
      console.error("An error occurred while fetching active users:", error);
    }
  };
     


  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
      await fetchData()
      await fetchForLineChart()
      const date = new Date();
const formattedTime = date.toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});
      setRefreshData(formattedTime)
    setIsRefreshing(false)
  }

  // Filter active users based on search term
  const filteredUsers = activeUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center">
          <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Last updated: Today, {refreshData}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Users */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{stats.totalUsers}</h3>
                    <span className="ml-2 text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="font-medium text-green-600 dark:text-green-400">{stats.activeUsers}</span> currently
                active
              </p>
            </div>

            {/* Total Datasets */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Datasets</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{stats.totalDatasets}</h3>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                  <Database className="h-6 w-6" />
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="font-medium">{Math.round(stats.totalDatasets * 0.7)}</span> annotated
              </p>
            </div>

            {/* Total Annotators */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Annotators</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                      {stats.totalAnnotators}
                    </h3>
                  </div>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="font-medium">{Math.round(stats.totalAnnotators * 0.8)}</span> active this week
              </p>
            </div>

            {/* Total Tasks */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</p>
                  <div className="flex items-baseline">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{stats.totalTasks}</h3>
                    <span className="ml-2 text-sm font-medium text-red-600 dark:text-red-400 flex items-center">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full">
                  <CheckSquare className="h-6 w-6" />
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                <span className="font-medium text-green-600 dark:text-green-400">{stats.completedTasks}</span>{" "}
                completed,
                <span className="font-medium text-amber-600 dark:text-amber-400 ml-1">{stats.pendingTasks}</span>{" "}
                pending
              </p>
            </div>
          </div>

          {/* Charts and Active Users */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Line Chart - Login Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border border-gray-200 dark:border-gray-700 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Login Activity</h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  Last 7 days
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={loginData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="day" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        borderColor: "#374151",
                        color: "#F9FAFB",
                      }}
                      itemStyle={{ color: "#F9FAFB" }}
                      labelStyle={{ color: "#F9FAFB" }}
                    />
                    <Line type="monotone" dataKey="logins" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart - User Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Distribution</h3>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                  <PieChart className="h-5 w-5" />
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={userDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Active Users Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Users</h3>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <button className="inline-flex items-center justify-center p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-semibold">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "Admin"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center">
                          <span
                            className={`h-2.5 w-2.5 rounded-full mr-2 ${
                              user.status ? "bg-green-500" : "bg-amber-500"
                            }`}
                          ></span>
                          {user.status ? "Active" : "Deactivated"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
                  Previous
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">{filteredUsers.length}</span> of{" "}
                    <span className="font-medium">{filteredUsers.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
