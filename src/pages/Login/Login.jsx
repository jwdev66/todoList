/* eslint-disable no-unused-vars */
import React from "react";
import { Loader } from "lucide-react";
import { enqueueSnackbar } from 'notistack';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validateLoginSchema } from "../../schema/auth";
import { usePostData } from "../../api/query";

const Base = () => {
    const navigate = useNavigate();
    const { mutate, isLoading } = usePostData("/auth/login", []);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        resolver: yupResolver(validateLoginSchema),
    });

    const onSubmit = (data) => {
        mutate(data, {
            onSuccess: (res) => {
                localStorage.setItem("accessToken", res.token);
                localStorage.setItem("user", JSON.stringify(res));
                navigate("/dashboard");
            },
            onError: (err) => {
                enqueueSnackbar(err?.response?.data?.message, { variant: 'error' })
            }
        })
    }

    return (
        <div className="w-full">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl mb-8">
                  Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div>
                      <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
                      <input {...register('username')} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" placeholder="Username" required="" />
                      {errors?.username && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors?.username?.message}</p>
                      )}
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                      <input type="password" {...register('password')} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 " required="" />
                      {errors?.password && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors?.password?.message}</p>
                      )}
                  </div>
                  <div className="flex items-center justify-between">
                      <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" required="" />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="remember" className="text-gray-500">Remember me</label>
                          </div>
                      </div>
                      <a href="#" className="text-sm font-medium text-blue-600 hover:underline">Forgot password?</a>
                  </div>
                  <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    {isLoading ? <Loader className="inline-block mr-2 animate-spin text-white" /> : "Login"}
                  </button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don’t have an account yet? <Link to="/register" className="font-medium text-blue-600 hover:underline">Sign up</Link>
                  </p>
              </form>
          </div>
        </div>
    );
}

export default Base;
