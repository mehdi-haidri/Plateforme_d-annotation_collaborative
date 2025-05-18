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
  const [classe , setClasse] = useState('');
useEffect(() => {
    setCurrentCouple(data);
    setMaxIndex(totalPages - 1);
  setCurrentIndex(index);
  console.log(index);
    if (isAnnotated) {
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
           if (data.data?.annotated) {
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
          console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-4">
      <div className="flex flex-col items-center space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Text 1</h3>
        <p className="text-gray-700 dark:text-gray-300 text-center">{currentCouple?.text1}</p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Text 2</h3>
        <p className="text-gray-700 dark:text-gray-300 text-center">{currentCouple?.text2}</p>

        <div className="mt-4 w-full">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Select Label</label>
          <select
            value={classe}
            onChange={(e) =>setClasse(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:text-white"
          >
            <option  value="">-- Select Label --</option>
                      {classes.map((label) => (
                          <option   key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="flex mt-4 space-x-2">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-sm bg-gray-200 rounded-lg text-white hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={handleSave}
            // disabled={!selectedLabel}
            className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Save
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex == maxIndex}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Next
          </button>
        </div> */}
        <div className="flex flex-col items-center">
      {/* Help text */}
      <span className="text-sm text-gray-700 dark:text-gray-400">
        Showing{' '}
        <span className="font-semibold text-gray-900 dark:text-white">{currentIndex + 1}</span> {" "} of{' '}
        <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span> Entries
      </span>
      {/* Buttons */}
      <div className="inline-flex mt-2 gap-2 xs:mt-0">
        <button
          onClick={handlePrevious}
            disabled={currentIndex === 0}
          className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
               <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
        </svg>
          Prev
            </button>
            <button
            onClick={handleSave}
            // disabled={selectedLabel}
            className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
           {isLoading ? <span className="loading loading-dots loading-md"></span>: "Save"}
          </button>
        <button
            onClick={handleNext}
            hidden={currentIndex == maxIndex}
          className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-gray-800 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
              Next 
               <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
        </svg>
        </button>
      </div>
    </div>
        {/* <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {currentIndex + 1} / {data.length}
        </div> */}
      </div>
    </div>
  );
};

export default TextAnnotationCard;
