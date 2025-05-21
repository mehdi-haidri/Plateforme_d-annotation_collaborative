import { useEffect, useState } from "react"
import { useOutletContext, useParams } from "react-router-dom"
import { Calendar, Database, FileText, Clock, BarChart3, Tag, AlertCircle, Loader2 } from "lucide-react"
import TextAnnotationCard from "../Components/TextAnnotationCard"

const API_URL = import.meta.env.VITE_API_URL

// Mock data for the task info
const MOCK_TASK_INFO = {
  taskId: 123,
  creationDate: "2025-05-10",
  limitDate: "2025-05-25",
  datasetName: "Text Classification Dataset",
  datasetDescription: "A dataset containing pairs of text for sentiment analysis and classification",
  totalRows: 320,
  taskRows: 80,
  advancement: 42,
}


function TextCouples() {
  const { task_id } = useParams()
  const [textCouple, setTextCouple] = useState({})
  const [classes, setClasses] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [annotated, setAnnotated] = useState(false)
  const [currentClasse, setCurrentClasse] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const { setAlert } = useOutletContext()
  const [isLoading, setIsLoading] = useState(true)
  const [taskInfo, setTaskInfo] = useState(MOCK_TASK_INFO)

    const fetchLatestTextCouple = async () => {
        try {
            setIsLoading(true)
            let response = await fetch(
                API_URL + `annotator/task/${task_id}/lastAnnotated`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            console.log(response);
            let data = await response.json();
            setTextCouple(data.data?.textCouple);
            setClasses(data.data?.classes);
            setTotalPages(data.data?.totalPages);
            setCurrentIndex(data.data?.index);
            if (data.data?.annotated) {
                setAnnotated(true);
                setCurrentClasse(data.data?.currentClasse);
            }
            await fetchTask();
        } catch (error) {
            setAlert({ type: "error", message: "server Error" });
            console.error(error);
        }finally {
            setIsLoading(false)
        }
        
    }

  const fetchTask = async () => {
      try {
      
          let response = await fetch(
              API_URL + "annotator/task/"+task_id,
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

          setTaskInfo(response?.data?.task)
        
       
      } catch (error) {
          setAlert({ type: "error", message: "server Error" });
          console.error(error);
      }
  };
    

    useEffect(() => {
        fetchLatestTextCouple();
    }, []);
  return (
     <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Task Info Bar */}
      <div className="w-full md:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5 h-fit">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mr-3">
            <Database className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Task Information</h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                <Database className="h-4 w-4 mr-1" />
                Dataset
              </h3>
              <p className="text-base font-medium text-gray-900 dark:text-white">{taskInfo.dataset}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{taskInfo.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created
                </h3>
                <p className="text-sm text-gray-900 dark:text-white">{taskInfo.startDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Due Date
                </h3>
                <p className="text-sm text-gray-900 dark:text-white">{taskInfo.limitDate}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Dataset Rows
                  </h3>
                  <p className="text-sm text-gray-900 dark:text-white">{taskInfo.totalRows}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Task Rows
                  </h3>
                  <p className="text-sm text-gray-900 dark:text-white">{taskInfo.rowCount}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Classes
              </h3>
              <div className="flex flex-wrap gap-2">
                {classes.length > 0 ? (
                  classes.map((cls, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                    >
                      {cls}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">No classes defined</span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                <BarChart3 className="h-4 w-4 mr-1" />
                Progress
              </h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full dark:bg-purple-500"
                    style={{ width: `${((currentIndex+1 )/ totalPages) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {currentIndex+1}/{totalPages}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Task ID:</span>
                <span className="font-medium text-gray-900 dark:text-white">#{task_id}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Text Annotation Card */}
      <div className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 text-purple-600 animate-spin mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Loading annotation data...</p>
            </div>
          </div>
        ) : Object.keys(textCouple).length > 0 ? (
          <TextAnnotationCard
            totalPages={totalPages}
            index={currentIndex}
            currentClasse={currentClasse}
            isAnnotated={annotated}
            classes={classes}
            data={textCouple}
          />
        ) : (
          <div className="flex items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center text-center px-4">
              <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No annotation data available</h3>
              <p className="text-gray-500 dark:text-gray-400">
                There are no text couples available for annotation in this task.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



export default TextCouples