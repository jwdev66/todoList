import React from "react";
import { createBrowserRouter } from "react-router-dom";
import routeMap from "./routeMap";
import Auth from "../layout/Auth";

import { Login, Register, Dashboard } from "../pages";

const ErrorPage = () => {
    return (
        <>
            <div className="flex jusify-center items-center w-full h-[70vh]">
                <h1 className="text-2xl font-bold text-center w-full">Page Not Found!</h1>
            </div>
        </>
    );
}

export const noneAuthRoutes = [
    {
        path: routeMap.base,
        element: <Auth />,
        children: [
            {
                path: routeMap.base,
                index: false,
                element: <Login />,
                errorElement: <ErrorPage />,
            },
            {
                path: routeMap.login,
                index: false,
                element: <Login />,
                errorElement: <ErrorPage />,
            },
            {
                path: routeMap.register,
                index: false,
                element: <Register />,
                errorElement: <ErrorPage />,
            },
        ],
    },
];

export const authRoutes = [
    {
        path: routeMap.dashboard,
        index: false,
        element: <Dashboard />,
        errorElement: <ErrorPage />,
    },
    {
        name: "404",
        path: "*",
        element: <ErrorPage />,
    },
]

const router = createBrowserRouter([...noneAuthRoutes, ...authRoutes]);

export default router;
