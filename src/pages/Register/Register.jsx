/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validateRegisterSchema } from "../../schema/auth";
import { usePostData } from "../../api/query";
import { enqueueSnackbar } from "notistack";
import { Loader } from "lucide-react";

const Base = () => {
    const navigate = useNavigate();
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        resolver: yupResolver(validateRegisterSchema),
    });
    const { mutate, isLoading } = usePostData("/auth/register", []);

    const onSubmit = (data) => {
        mutate({
            username: data.username,
            email: data.email,
            password: data.password
        }, {
            onSuccess: () => {
                navigate("/login");
            },
            onError: (err) => {
                enqueueSnackbar(err?.response?.data?.message, { variant: 'error' })
            }
        })
    }
    
    return (
        <div className="w-full">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                  Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Username</label>
                      <input type="text" {...register('username')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" placeholder="Username" required="" />
                      {errors?.username && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors?.username?.message}</p>
                      )}
                  </div>
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
                      <input type="email" {...register('email')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" placeholder="Your email" required="" />
                      {errors?.email && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors?.email?.message}</p>
                      )}
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                      <input type="password" {...register('password')} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" required="" />
                      {errors?.password && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors?.password?.message}</p>
                      )}
                  </div>
                  <div>
                      <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900">Confirm password</label>
                      <input type="password" {...register('confirmPassword')} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5" required="" />
                      {errors?.confirmPassword && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors?.confirmPassword?.message}</p>
                      )}
                  </div>
                  <div>
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="terms" aria-describedby="terms" type="checkbox" {...register('termsOfService')} className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" required="" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="font-light text-gray-500">I accept the <a className="font-medium text-blue-600 hover:underline" href="#">Terms and Conditions</a></label>
                        </div>
                    </div>
                    {errors?.termsOfService && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors?.termsOfService?.message}</p>
                    )}
                  </div>
                  <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    {isLoading ? <Loader className="inline-block mr-2 animate-spin text-white" /> : "Create an account"}
                  </button>
                  <p className="text-sm font-light text-gray-500">
                      Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:underline">Login here</Link>
                  </p>
              </form>
          </div>
        </div>
    );
}

export default Base;
