/* eslint-disable react/prop-types */
import { Draggable } from "react-beautiful-dnd";
import { GripVertical, SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import { useDeleteData, usePatchData, usePostData } from "../api/query";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { validateTaskSchema } from "../schema/task";
import { enqueueSnackbar } from "notistack";

const Card = ({ title, checked, draggableId, index, id }) => {
    const [check, setCheck] = useState(checked);
    const [isEdit, setEdit] = useState(false);

    const {
        register,
        setValue,
        getValues,
        reset
    } = useForm({
        resolver: yupResolver(validateTaskSchema),
    });
    const { mutate: editTask } = usePatchData(`/tasks/${id}`, ["tasks"]);
    const { mutate } = usePostData(`/tasks/${id}`, ["tasks"]);
    const { mutate: deleteTask } = useDeleteData(`/tasks/${id}`, ["tasks"]);

    const _handleKeyDown = e => {
        setValue("title", e.target.value);
        const t = getValues("title");
        if (e.key === 'Enter') {
            if (t) {
                editTask({ title: e.target.value }, {
                    onSuccess: () => {
                        setEdit(false);
                        reset();
                    },
                    onError: (err) => {
                        enqueueSnackbar(err?.response?.data?.message, { variant: 'error' });
                    }
                });
            } else {
                enqueueSnackbar("Title field cannot be empty", { variant: 'error' });
            }

        }
    }

    const handleCheck = e => {
        setCheck(e.target.checked);
        mutate({}, {
            onSuccess: () => {}
        });
    }

    return (
        <Draggable draggableId={draggableId} index={index} key={index.toString()}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${
                    snapshot.isDragging ? "bg-gray-300" : "bg-gray-100"
                    } pl-3 pr-5 py-3 flex justify-between items-center rounded-xl cursor-pointer todo-card border-l-[6px] mb-3`}
                >
                    <div className="flex items-center">
                        <input className="hidden" type="checkbox" id={`uncheck-${title}`} onChange={handleCheck} checked={check} />
                        <label className="flex items-center h-10 px-2 rounded cursor-pointer" htmlFor={`uncheck-${title}`}>
                            <span className="checkbox-inner flex items-center justify-center w-5 h-5 text-transparent border-2 border-gray-300 rounded-full"></span>
                            {!isEdit && <span className="mx-4">{title}.</span>}
                        </label>
                        {isEdit ? <input defaultValue={title} maxLength={20} {...register('title')} className="border-none bg-inherit outline-none" autoFocus onBlur={_handleKeyDown} onKeyDown={_handleKeyDown} /> : null}
                    </div>
                    <div className="flex items-center">
                        <div className="edit-icon mr-4">
                            <SquarePen className="cursor-pointer" color="#9ca3af" size={17} onClick={() => setEdit(id)} />
                        </div>
                        <div className="edit-icon mr-4">
                            <Trash className="cursor-pointer" color="#9ca3af" size={17} onClick={() => deleteTask()} />
                        </div>
                        <GripVertical color="#9ca3af" size={17} />
                    </div>
                </div>
            )}
        </Draggable>
    );
  };
  
  export default Card;
  