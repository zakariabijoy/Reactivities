import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import ActivityDashboard from "../../features/activities/dashboad/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestError";
import NotFound from "../../features/errors/NotForund";
import ServerError from "../../features/errors/ServerError";
import LoginForm from "../users/LoginForm";
import ProfilePage from "../../features/Profiles/ProfilePage";

export const routes: RouteObject[] =[
    {
        path: '/',
        element: <App/>,
        children:[
            { path:'activities', element: <ActivityDashboard/>},
            { path:'activities/:id', element: <ActivityDetails/>},
            { path:'createActivity', element: <ActivityForm key='create'/>},  // have to use key if we want to use same component for diffrent route to reset state
            { path:'manage/:id', element: <ActivityForm key='manage'/>},
            { path:'profiles/:username', element: <ProfilePage/>},
            { path:'login', element: <LoginForm/>},
            { path:'errors', element: <TestErrors/>},
            { path:'not-found', element: <NotFound/>},
            { path:'server-error', element: <ServerError/>},
            { path:'*', element: <Navigate replace to='/not-found'/>}
        ]
    },
]

export const router = createBrowserRouter(routes);