import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import roles from "../../config/roles";

const API_URL = import.meta.env.VITE_API_URL;

function UpdateAnnotator() {
  const Navigate = useNavigate();
  const { id } = useParams();
  const { setAlert } = useOutletContext();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      let response = await fetch(`${API_URL}users/annotator/update`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          firstName,
          lastName,
          email,
          password,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      response = await response.json();
      console.log(response);
      setAlert({ type: "success", message: "Annotator created successfully" });
      Navigate(`${roles.ROLE_ADMIN}/annotators`);
    } catch (error) {
      console.error(error);
    }
  };

  const getAnnotator = async () => {
    setIsLoading(true);
    try {
      let response = await fetch(
        API_URL + "users/annotators/annotator/" + id, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      response = await response.json();
      console.log(response);
      response.data?.annotator.firstName && setFirstName(response.data?.annotator.firstName);
      response.data?.annotator.lastName && setLastName(response.data?.annotator.lastName);
      response.data?.annotator.email && setEmail(response.data?.annotator.email);
      response.data?.annotator.password && setPassword(response.data?.annotator.password);
    } catch (error) {
      setAlert({ type: "error", message: "Annotators not found" });
      console.error(error);
    }
    setIsLoading(false);
  };

    useEffect(() => {
      console.log(id);
    getAnnotator();
  }, []);

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
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
          />
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
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
          />
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
            type="text"
            placeholder="Email"
            id="email"
            required
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
          />
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
  
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
          />
        </div>
        <button
          onClick={handleSubmit}
          type="submit"
          className="text-white  min-h-[42px] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
        {isLoading ? <span className="loading loading-dots loading-md "></span>: "Save"}
        </button>
      </form>
    </>
  );
}

export default UpdateAnnotator;
