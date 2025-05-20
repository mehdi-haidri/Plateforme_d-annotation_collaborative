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
import SignInSection from "../Login/SignInSection";
import AnnotatorLayout from "../Annotator/Layout"
import Midlware from "../Midlware";
import AnnotatorTaskList from "../Annotator/task/Tasks";
import TextCouples from "../Annotator/task/TextCouples";
import Dashboard from "../Admin/Dashboard";
import Profile from "../Admin/components/Profile";


const Routes = [
    {
        path: "/",
        element: <SignInSection/>
    },
    {
        path: "/admin",
        element: <Midlware  role = "ROLE_ADMIN"   > <Layout /></Midlware> ,
        children: [
            {
                path: "",
                element: <Dashboard />
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
                path :"profile",
                element: <Profile/>

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
    ,
    {
        path: "/annotator",
        element: <Midlware role = "ROLE_ANNOTATOR"><AnnotatorLayout /> </Midlware>,
        children: [
            {
                path: "tasks",
                element: <AnnotatorTaskList/>
            }, {
                path:"task/:task_id",
                element:<TextCouples/>
            }
        ]
    },
    {
        path: "/login",
        element: <SignInSection/>
    }
]

function AppRoutes() {
    
    const Route = useRoutes(Routes);
    return Route;
}

export default AppRoutes