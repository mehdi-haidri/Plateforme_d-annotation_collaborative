import { useRoutes } from "react-router-dom";
import Layout from "../Admin/Layout";

import Datasets from "../Admin/dataset/Datasets";

const Routes = [
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "home",
                element: <h1>Home</h1>
            },
            {
                path: "datasets",
                element: <Datasets/>
            }
        ]
    }
]

function AppRoutes() {

    const Route = useRoutes(Routes);
    return Route;
}

export default AppRoutes