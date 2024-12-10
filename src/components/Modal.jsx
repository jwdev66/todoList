/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { validateTaskSchema } from "../schema/task";
import { usePostData } from "../api/query";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { Loader } from "lucide-react";

const Modal = ({ modalOpen, closeModal }) => {
    const navigate = useNavigate();
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({
        resolver: yupResolver(validateTaskSchema),
    });
    const { mutate, isLoading } = usePostData("/tasks", ["tasks"]);

    const onSubmit = (data) => {
        mutate(data, {
            onSuccess: () => {
                reset();
                closeModal();
            },
            onError: (err) => {
                enqueueSnackbar(err?.response?.data?.message, { variant: 'error' });
            }
        })
    }

    if (!modalOpen) return null;

    return createPortal(
        <div id="authentication-modal" tabIndex="-1" aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 bottom-0 z-50 justify-center items-center w-full md:inset-0 h-screen max-h-full" style={{ background: "rgb(107 114 128 / 0.75)" }}>
            <div className="w-full h-full flex justify-center items-center">
                <div className="relative bg-white rounded-lg shadow lg:w-4/12 w-10/12">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Create Task
                        </h3>
                        <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="authentication-modal" onClick={closeModal}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>


                    <div className="p-4 md:p-5">
                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-6">
                                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                                <input type="text" {...register('title')} maxLength={25} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Title" />
                                {errors?.title && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors?.title?.message}</p>
                                )}
                            </div>
                            <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                {isLoading ? <Loader className="inline-block mr-2 animate-spin text-white" /> : "Create"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>,
        document.getElementById('modal')
    );
}

export default Modal;
