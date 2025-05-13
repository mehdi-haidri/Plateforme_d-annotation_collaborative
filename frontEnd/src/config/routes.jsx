import { useRoutes } from "react-router-dom";
import Layout from "../Admin/Layout";

import Datasets from "../Admin/dataset/Datasets";
import DatasetForm from "../Admin/dataset/DatasetForm";
import AddAnnotators from "../Admin/dataset/AddAnnotators";

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
                element: <Datasets />,
            
            },
            {
                        path: "datasets/AddDataset",
                        element: <DatasetForm/>
                    },
                    {
                        path: "datasets/add-annotators/:id",
                        element: <AddAnnotators/>
                    }
        ]
    }
]

function AppRoutes() {

    const Route = useRoutes(Routes);
    return Route;
}

export default AppRoutes