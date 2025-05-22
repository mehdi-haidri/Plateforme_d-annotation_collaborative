import { Link, useOutletContext } from "react-router-dom";
import roles from "../../config/roles";
import {
  Download,
  Info,
  UserPlus,
  AlertTriangle,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;
const Table = ({ colums, rows, currentPage, setCurrentPage, totalPages ,handleRefresh }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { setAlert } = useOutletContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handlDownload = async (id) => {
    try {
      setIsDownloading(true);
      const response = await fetch(`${API_URL}datasets/download/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `dataset-${id}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlDelete = async (id) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}datasets/dataset/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setAlert({ type: "success", message: "Dataset deleted successfully" });
      handleRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="px-4 py-6">
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
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    #{row.id}
                  </td>
                  {colums.map((col, index) => {
                    if (
                      col.field !== "id" &&
                      col.field !== "action" &&
                      col.field !== "status"
                    ) {
                      return (
                        <td key={index} className="px-6 py-4">
                          {row[col.field]}
                        </td>
                      );
                    }
                    return null;
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
                        onClick={() => handlDelete(row.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                      >
                        <XCircle className="w-3 h-3" />
                        {isDeleting[row.id] ? (
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
                            Creating...
                          </div>
                        ) : (
                          "Delete"
                        )}
                      </button>
                      <button
                        onClick={() => handlDownload(row.id)}
                        disabled={
                          row.advancement !== row.size || isDownloading[row.id]
                        }
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
            <AlertTriangle
              size={48}
              className="text-gray-300 dark:text-gray-600 mb-4"
            />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No datasets found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              There are no datasets available. Try adding a new dataset.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
        <div className="text-sm text-gray-700 dark:text-gray-400">
          Page<span className="font-medium">{currentPage + 1}</span> of{" "}
          <span className="font-medium">{totalPages}</span> Pages
        </div>
        <div className="inline-flex gap-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50  disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50  disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
