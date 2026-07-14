import { createBrowserRouter } from "react-router";
import Login from "@/features/auth/Login";
import Register from "@/features/auth/Register";
import { AppWrapper } from "@/AppWrapper";
import { PublicRoute } from "./PublicRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import App from "@/App";
import NotFound from "@/pages/NotFound";
import Home from "@/features/interview/pages/Home";
import Interview from "@/features/interview/pages/Interview";
import ReportDetail from "@/features/interview/pages/ReportDetail";

const routes = [
    {
        path: "/",
        element: <AppWrapper />,
        children: [
            {
                element: <PublicRoute />,
                children: [
                    {
                        path: "/login",
                        element: <Login />,
                    },
                    {
                        path: "register",
                        element: <Register />,
                    },
                ],
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "",
                        element: <App />,
                        children: [
                            { index: true, element: <Home /> },
                            { path: "reports", element: <Interview /> },
                            { path: "reports/:reportId", element: <ReportDetail /> },
                        ],
                    },
                ],
            },
        ],
    },
    { path: "*", element: <NotFound /> },
];

export const AppRouter = createBrowserRouter(routes);
