import { useRoutes } from "react-router-dom";
import Layout from "../Admin/Layout";

import Datasets from "../Admin/dataset/Datasets";
import DatasetForm from "../Admin/dataset/DatasetForm";
import AddAnnotators from "../Admin/dataset/AddAnnotators";
import DatasetLayout from "../Admin/dataset/Layout";
import AnnotatorsLayout from "../Admin/annotators/Layout";
import Annotators from "../Admin/annotators/Annotators";
import AddAnnotator from "../Admin/annotators/AddAnnotator";
import UpdateAnnotator from "../Admin/annotators/UpdateAnnotator";
import DatasetDetails from "../Admin/dataset/DatasetDetails";

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
                element: <DatasetLayout />,
                children: [
                {
                path: "",
                element: <Datasets/>
            },
                    {
                path: "AddDataset",
                element: <DatasetForm/>
            },
            {
                path: "add-annotators/:id",
                element: <AddAnnotators/>
                    },
                    {
                path: ":id",
                element: <DatasetDetails/>
            }
                ]
            },
            {
                path: "annotators",
                element: <AnnotatorsLayout />,
                children: [
                    {
                        path: "",
                        element: <Annotators></Annotators>
                    },
                    {
                        path: "addAnnotator",
                        element: <AddAnnotator/>
                    },
                    {
                        path: "updateAnnotator/:id",
                        element: <UpdateAnnotator/>
                    },
                   
                ]
            }
            
        ]
    }
]

function AppRoutes() {

    const Route = useRoutes(Routes);
    return Route;
}

export default AppRoutes