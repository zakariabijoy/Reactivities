import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import ActivityDashboard from "../../features/activities/dashboad/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestError";

export const routes: RouteObject[] =[
    {
        path: '/',
        element: <App/>,
        children:[
            { path:'activities', element: <ActivityDashboard/>},
            { path:'activities/:id', element: <ActivityDetails/>},
            { path:'createActivity', element: <ActivityForm key='create'/>},  // have to use key if we want to use same component for diffrent route to reset state
            { path:'manage/:id', element: <ActivityForm key='manage'/>},
            { path:'errors', element: <TestErrors/>}
        ]
    },
]

export const router = createBrowserRouter(routes);