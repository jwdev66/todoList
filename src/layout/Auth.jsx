/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setAuth] = useState(() => {
        if (localStorage.getItem("accessToken")) {
            return true;
        }

        return false;
    });

    if (isAuthenticated) {
        return navigate("/dashboard");
    }

    return (
        <div className="h-screen w-full flex items-center justify-center">
            <div className="flex w-full justify-center items-center lg:w-5/12 lg:px-24 px-8">
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;
