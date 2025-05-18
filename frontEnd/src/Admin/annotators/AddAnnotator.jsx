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
    <>
      <div>
        <h1 className="m-5 font-bold text-2xl">New Annotator</h1>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className=" col-span-2 mx-auto max-w-[80%] xl:max-w-[50%] "
      >
        <div className="mb-5">
          <label
            htmlFor="firstName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            first Name
          </label>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            type="firstName"
            id="firstName"
            placeholder="firstName"
            required
            className={`input validator  ${validation?.firstName ? 'border-red-500' : 'border-gray-300'}  shadow-xs  bg-gray-50  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white   dark:shadow-xs-light`}
            />
            <div className="validator-hint">{validation?.firstName}</div>
        </div>

        <div className="mb-5">
          <label
            htmlFor="lastName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            last Name
          </label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            type="lastName"
            id="lastName"
            placeholder="lastName"
            required
           className={`input validator  ${validation?.lastName ? 'border-red-500' : 'border-gray-300'}  shadow-xs  bg-gray-50  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white   dark:shadow-xs-light`}
            />
            <div className="validator-hint">{validation?.lastName}</div>
        </div>

        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            id="email"
            required
            className={`input validator  ${validation?.email ? 'border-red-500' : 'border-gray-300'}  shadow-xs  bg-gray-50  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white   dark:shadow-xs-light`}
            />
            <div className="validator-hint">{validation?.email}</div>
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            id="password"
            required
            className={`input validator  ${validation?.password ? 'border-red-500' : 'border-gray-300'}  shadow-xs  bg-gray-50  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white   dark:shadow-xs-light`}
            />
            <div className="validator-hint">{validation?.password}</div>
        </div>
        <button
          onClick={handleSubmit}
          type="submit"
          className="text-white min-h-[42px]  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
                  {isLoading ? <span className="loading loading-dots loading-md"></span>: "Save"}

        </button>
      </form>
    </>
  );
}

export default AddAnnotator;
