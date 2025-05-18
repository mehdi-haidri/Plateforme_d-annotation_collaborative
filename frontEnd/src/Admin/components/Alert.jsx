import { useEffect } from "react";


function Alert({ alert , setAlert }) {
  
  const alertTypeClasses = {
  success: 'alert-success',
  error: 'alert-error',
  warning: 'alert-warning',
  };
  
  useEffect(() => {
    setTimeout(() => {
      setAlert(null);
    }, 8000);
  })
  return (
  <div role='alert' className={`p-1 z-999 alert ${alertTypeClasses[alert?.type]} text-gray-800 mt-4  absolute top-0 right-[40%]`}>
  <span className="flex items-center  gap-3 text-md font-medium">{alert?.message}<svg onClick={e => {
                        e.preventDefault();
                        setAlert(null);
                      }}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6  hover:cursor-pointer hover:text-gray-600 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg></span>
</div>
  )
}



export default Alert