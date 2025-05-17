import { useState, useRef, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import roles from "../../config/roles";
export default function DatasetForm() {
  const [date, setDate] = useState(new Date());
  const Navigate = useNavigate();
  const { setAlert } = useOutletContext();
  const [file, setFile] = useState();
  const requestError = useRef({});
  const [annotators, setAnnotators] = useState([ ]);
  const [selectedAnnotators, setSelectedAnnotators] = useState([]);
  const inputRef = useRef(null);
  const [classes, setClasses] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [validation, setValidation] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
 
  useEffect(() => {
    fetchAnnotators();
  }, [])
 
  const fetchAnnotators = async () => {
    try {
      let response = await fetch(
        API_URL + "users/annotators/true", {
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
      setAnnotators(response.data?.annotators.map((annotator) => {
        return { id: annotator.id, name: annotator.firstName + " " + annotator.lastName }
      }));
    } catch (error) {
      setAlert({ type: "error", message: "Annotators not found" });
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    console.log(classes.split(";").length > 1 ? classes.split(";") : "");
    const formData = new FormData();
    file && formData.append("file", file);
    formData.append("name", name);
    formData.append("annotators", JSON.stringify(selectedAnnotators.map((annotator) => annotator.id)));
    classes.split(";").length > 1 && formData.append("classes",JSON.stringify(classes.split(";")));
    formData.append("description", description);
    formData.append("datelimit", date?.toISOString().split('T')[0]);

    try {
      let response = await fetch(API_URL + 'datasets/addDataset', {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      body: formData,
      })
      
      if (!response.ok || response?.error == true) {
        requestError.current = response
        throw new Error("Network response was not ok");
      }
      response = await response.json();
      console.log(response);
      setAlert({ type: "success", message: "Dataset created successfully" });
      Navigate(roles.ROLE_ADMIN+'/datasets');
     
    } catch (error) {
      if (requestError.satus == 500) {
        setAlert({ type: "error", message: "server Error" });
      } else if (requestError.current.status == 400 ) {
        const response = await requestError.current.json()
        response.data?.errorType == "validation" ? setValidation(response.data.errors) : setAlert({ type: "error", message: "Bad request" });
        console.log(response.data.errors);
      }
    }
      
    
   
  }
  const handleSelectedAnnotator = (annotator) => {
    selectedAnnotators.push(annotator);
    setAnnotators(annotators.filter((a) => a.id !== annotator.id));
  };
  const handleUnSelectedAnnotator = (annotator) => {
    annotators.push(annotator);
    setSelectedAnnotators(selectedAnnotators.filter((a) => a.id !== annotator.id));
  };

  return (
    <>
      <div>
        <h1 className="m-5 font-bold text-2xl">New Dataset</h1>
      </div>

      <div className="grid md:grid-cols-4 md:gap-6 max-w-[95%] 2xl:max-w-[80%] mx-auto ">
        <form  onSubmit={(e) =>  e.preventDefault()} className=" col-span-2  w-full ">
        
         
            <div className="mb-5">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Name
              </label>
              <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="name"
              placeholder="dataset name"
              required
              className={`input validator  ${validation?.name ? 'border-red-500' : 'border-gray-300'}  shadow-xs  bg-gray-50  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white   dark:shadow-xs-light`}
            />
            <div className="validator-hint">{validation?.name}</div>
            </div>

            <div className="mb-5">
              <label
                htmlFor="Description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                id="Description"
                placeholder="Description"
                required
              className={`input validator  ${validation?.description ? 'border-red-500' : 'border-gray-300'}  shadow-xs  bg-gray-50  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white   dark:shadow-xs-light`}
              />
           <div id="description" className="validator-hint">{validation?.description}</div>
          </div>

            <div className="mb-5">
              <label
                htmlFor="labels"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                labels
              </label>
              <input
                value={classes}
                onChange={(e) => setClasses(e.target.value)}
                type="text"
                placeholder="A;B;C"
                id="labels"
                required
              className={`input validator  ${validation?.classes ? 'border-red-500' : 'border-gray-300'}  shadow-xs  bg-gray-50  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white   dark:shadow-xs-light`}
            />
            <div className="validator-hint">{validation?.classes}</div>
            </div>

          <div className="mb-5 ">
            <div className="flex ">
              <button
                onClick={() => {
                  inputRef.current.click();
                }}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none "
              >
                <input
                  onChange={(e) => setFile(e.target.files[0])}
                  ref={inputRef}
                  className=" hidden w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  placeholder="Add file"
                  id="file"
                  type="file"
                />
                Add file
              </button>
              <h1>{file && file.name}</h1>
              </div>
           {  validation?.file && <div className="validator-hint visible text-red-500 ">{validation?.file}</div>}
            </div>
        <button
          onClick={handleSubmit}
          type="submit"
          className="text-white min-h-[42px]  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            
                  {isLoading ? <span className="loading loading-dots loading-md"></span>: "Save"}
        </button>
      </form>

        <div className=" col-span-2 grid md:grid-cols-3 md:gap-6">
            <div className="col-span-2">
              <ul className="list bg-base-100 rounded-box shadow-md">
                <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
                  Annotators
                </li>

                {selectedAnnotators.map((annotator) => (
                  <li key={annotator.id} className="list-row py-0  ">
                    <div className="text-xl content-center  font-thin opacity-30 tabular-nums">
                      0{annotator.id}
                    </div>

                    <div className="content-center">
                      <div>{annotator.name}</div>
                    </div>
                    <button className="btn btn-square btn-ghost">
                      <svg onClick={e => {
                        handleUnSelectedAnnotator(annotator);
                      }}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
              {selectedAnnotators.length > 0 &&  <>
                      <p className="input-label inline-block mx-2">limit date : </p>
                       <button  popoverTarget="rdp-popover" className=" my-4 input focus:outline-none" style={{ anchorName: "--rdp" } }>
                      {date ? date.toLocaleDateString() : "Pick a date"}
                    </button>
                    <div popover="auto" id="rdp-popover" className="dropdown" style={{ positionAnchor: "--rdp" }}>
                      <DayPicker className="react-day-picker" mode="single" selected={date} onSelect={setDate} />
                    </div>
                  </>}
            </div>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn m-1">
                Add annotator
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                {annotators.map((annotator) => (
                  <li
                    onClick={() => handleSelectedAnnotator(annotator)}
                    key={annotator.id}
                  >
                    <a>{annotator.name}</a>
                  </li>
                ))}
              </ul>
            </div>
        </div>
        
      </div>
      
    </>
  );
}
