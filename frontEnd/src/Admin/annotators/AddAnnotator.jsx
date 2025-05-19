import { useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function AddAnnotator() {
  const Navigate = useNavigate();
  const { setAlert } = useOutletContext();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validation, setValidation] = useState({});
  const requestError = useRef({});
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let response = await fetch(API_URL+"users/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role: "ROLE_ANNOTATOR",
        }),
      });

      if (!response.ok || response?.error == true) {
        console.log(response);
        requestError.current = response;
        throw new Error("Network response was not ok");
      }
      response = await response.json();
      console.log(response);
      setAlert({ type: "success", message: "Annotator created successfully" });
      Navigate(`/admin/annotators`);
    } catch (error) {
      if (requestError.satus == 500) {
        setAlert({ type: "error", message: "server Error" });
      } else if (requestError.current.status == 400) {
        const response = await requestError.current.json();
        response.data?.errorType == "validation"
          ? setValidation(response.data.errors)
          : setAlert({ type: "error", message: "Bad request" });
        console.log(response.data.errors);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Annotator</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add a new annotator to your team</p>
      </div>

      {/* {successMessage && (
        <div
          className="p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          <span className="font-medium">Success!</span> {successMessage}
        </div>
      )} */}

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-900 dark:border-gray-700">
        <div className="p-6">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  First Name
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  id="firstName"
                  placeholder="Enter first name"
                  className={`block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border ${
                    validation?.firstName ? "border-red-500" : "border-gray-300"
                  } focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                />
                {validation?.firstName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">{validation.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Last Name
                </label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  id="lastName"
                  placeholder="Enter last name"
                  className={`block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border ${
                    validation?.lastName ? "border-red-500" : "border-gray-300"
                  } focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                />
                {validation?.lastName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">{validation.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                placeholder="name@company.com"
                className={`block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border ${
                  validation?.email ? "border-red-500" : "border-gray-300"
                } focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {validation?.email && <p className="mt-1 text-sm text-red-600 dark:text-red-500">{validation.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                placeholder="••••••••"
                className={`block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border ${
                  validation?.password ? "border-red-500" : "border-gray-300"
                } focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              />
              {validation?.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-500">{validation.password}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setFirstName("")
                  setLastName("")
                  setEmail("")
                  setPassword("")
                  setValidation({})
                }}
                className="text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 shadow-sm transition-all duration-200 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                type="submit"
                disabled={isLoading}
                className="text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-2.5 shadow-sm transition-all duration-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
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
                  "Create Annotator"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAnnotator;
