
import { Link } from 'react-router-dom';
import roles from '../../config/roles';
import { Download, Info, UserPlus, AlertTriangle, Check, Loader2 } from "lucide-react"
import { useState } from 'react';
const API_URL = import.meta.env.VITE_API_URL;
const Table = ({ colums, rows }) => {
    const [isDownloading, setIsDownloading] = useState(false)
  const handlDownload =  async(id) => {
    
    try {
      setIsDownloading(true)
      const response = await fetch(`${API_URL}datasets/download/${id}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      })

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dataset-${id}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove()
      
    }catch (error) {
      console.error(error);
    }finally {
      setIsDownloading(false)
    }
  }
  return (
   <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs font-medium text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
            <tr>
              {colums.map((col) => (
                <th key={col.field} scope="col" className="px-6 py-4">
                  <div className="flex items-center">
                          {col?.icon}
                          {col.field.charAt(0).toUpperCase() + col.field.slice(1)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {rows.map((row) => (
              <tr
                key={row.id}
                className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">#{row.id}</td>
                {colums.map((col, index) => {
                  if (col.field !== "id" && col.field !== "action" && col.field !== "status") {
                    return (
                      <td key={index} className="px-6 py-4">
                        {row[col.field]}
                      </td>
                    )
                  }
                  return null
                })}
                <td className="px-6 py-4">
                  <Link
                    to={`${roles.ROLE_ADMIN}/datasets/add-annotators/${row.id}`}
                    className="inline-flex items-center"
                  >
                    {row.status ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-400">
                        <Check size={14} />
                        Annotated
                      </span>
                    ) : (
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50">
                        <UserPlus size={14} />
                        Add annotators
                      </button>
                    )}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link to={`${roles.ROLE_ADMIN}/datasets/${row.id}`}>
                      <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                        <Info size={14} />
                        Details
                      </button>
                    </Link>
                    <button
                      onClick={() => handlDownload(row.id)}
                      disabled={row.advancement !== row.size || isDownloading[row.id]}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        row.advancement === row.size
                          ? "text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                          : "text-gray-500 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {isDownloading[row.id] ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download size={14} />
                          Download
                        </>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <AlertTriangle size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No datasets found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            There are no datasets available. Try adding a new dataset.
          </p>
        </div>
      )}
    </div>
  );
};

export default Table;
