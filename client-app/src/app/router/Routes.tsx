import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboad/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

export const routes: RouteObject[] =[
    {
        path: '/',
        element: <App/>,
        children:[
            { path:'', element: <HomePage/>},
            { path:'activities', element: <ActivityDashboard/>},
            { path:'activities/:id', element: <ActivityDetails/>},
            { path:'createActivity', element: <ActivityForm/>}
        ]
    },
]

export const router = createBrowserRouter(routes);