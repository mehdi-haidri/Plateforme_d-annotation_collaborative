import {  useEffect, useState } from 'react';


import { useOutletContext, useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;
const TextAnnotationCard = ({ data ,classes , totalPages , currentClasse , isAnnotated , index }) => {
  const {task_id} = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCouple, setCurrentCouple] = useState(data);
  const { setAlert } = useOutletContext();
  const [maxIndex, setMaxIndex] = useState(0); 
  const [annotationStatus, setAnnotationStatus] = useState(isAnnotated)
  const [classe , setClasse] = useState('');
useEffect(() => {
    setCurrentCouple(data);
    setMaxIndex(totalPages - 1);
  setCurrentIndex(index);
  console.log(index);
  if (isAnnotated) {
      setAnnotationStatus(true);
     setClasse(currentClasse);
    }
}, [data])
  
    console.log(classe);

    const fetchTextCouple =  async(index) => {
      
        try {
            let response = await fetch(
                API_URL + `annotator/task/${task_id}/textcouple/${index}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            let data = await response.json();
          setCurrentCouple(data.data?.textCouple);
          setClasse("");
          setAnnotationStatus(false);
          if (data.data?.annotated) {
                setAnnotationStatus(true);
                setClasse(data.data?.currentClasse);
            }
            console.log(data);
        } catch (error) {
            console.error(error);
        }
      
  }
    const handleNext = async() => {
      setIsLoading(true);
       await fetchTextCouple(currentIndex + 1);
       setCurrentIndex((prev) => prev + 1);
       setIsLoading(false);
       
  };

  const handlePrevious = async () => {
    setIsLoading(true);
    fetchTextCouple(currentIndex -1);
    setCurrentIndex((prev) => prev - 1);
    setIsLoading(false);
  };

  const handleSave = async () => {
      setIsLoading(true);
      console.log(classe);
      console.log(currentCouple);
      if( classe === ''  || currentCouple.id === undefined) {
        alert('Please select a label and a text couple');
       
      }
    const newAnnotation = {
      textCoupleId: currentCouple.id,
      classe: classe,
      index: currentIndex,
    };
      try {
        let response = await  fetch(
          API_URL + `annotator/saveTextCouple`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(newAnnotation),
      });
      if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        response = await response.json();
        console.log(response);
       totalPages !== currentIndex + 1 && handleNext();
    } catch (error) {
          setAlert({ type: "error", message: "server Error" });
          // console.error(error);
    }
    setIsLoading(false);
  };

  return (
     <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Text Annotation</h2>
          {annotationStatus && (
            <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium dark:bg-blue-900 dark:text-blue-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Annotated
            </div>
          )}
        </div>

        {/* {error && (
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )} */}

        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Text 1</h3>
          {isLoading ? (
            <div className="w-full h-24 bg-gray-200 animate-pulse rounded-lg dark:bg-gray-700"></div>
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full min-h-[100px] text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
              {currentCouple?.text1 || "No text available"}
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Text 2</h3>
          {isLoading ? (
            <div className="w-full h-24 bg-gray-200 animate-pulse rounded-lg dark:bg-gray-700"></div>
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg w-full min-h-[100px] text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white">
              {currentCouple?.text2 || "No text available"}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-900 dark:text-white mb-2 text-lg font-medium">Select Label</label>
          <select
            value={classe}
            onChange={(e) => setClasse(e.target.value)}
            disabled={isLoading}
            className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">-- Select Label --</option>
            {classes.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
          {annotationStatus && classe && (
            <p className="mt-2 text-sm text-blue-700 flex items-center dark:text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Previously labeled as "{classe}"
            </p>
          )}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div
            className="bg-blue-700 h-2.5 rounded-full dark:bg-blue-500"
            style={{ width: `${((currentIndex + 1) / totalPages) * 100}%` }}
          ></div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{currentIndex + 1}</span> of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span> Entries
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isLoading}
            className="flex-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center">
              <svg
                className="w-4 h-4 mr-2 rtl:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Previous
            </div>
          </button>

          <button
            onClick={handleSave}
            disabled={!classe || isLoading}
            className="flex-1 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center">
              {isLoading ? (
                <>
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 mr-3 text-white animate-spin"
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
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"></path>
                  </svg>
                  Save
                </>
              )}
            </div>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= totalPages - 1 || isLoading}
            className="flex-1 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center">
              Next
              <svg
                className="w-4 h-4 ml-2 rtl:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextAnnotationCard;
