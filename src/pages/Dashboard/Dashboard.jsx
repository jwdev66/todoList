/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import Modal from "../../components/Modal";
import Droppable from "../../components/StrictModeDroppable";
import ItemsColumn from "../../components/ItemsColumn";
import { initialColumnData } from "./data";
import { useGetData } from "../../api/query";
import { Loader } from "lucide-react";

const Dashboard = () => {
  const perPage = 12;
    const navigate = useNavigate();
    const [modal, showModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [user, _setUser] = useState(() => {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      }
      
      return null;
    })
    const { data, isLoading, refetch } = useGetData(`/tasks?page=${currentPage}&limit=${perPage}`, ["tasks", currentPage], { enabled: !!currentPage });
    const [columnData, setColumnData] = useState(initialColumnData);

    useEffect(() => {
      const clone = {...columnData};
      const completed = data?.data?.data?.filter((task) => task.checked);
      const unCompleted = data?.data?.data?.filter((task) => !task.checked);
      clone.todoColumn.items = unCompleted;
      clone.doneColumn.items = completed;
      setColumnData(clone);
    }, [data]);

    const onNextPage = () => {
      setCurrentPage(currentPage+1);
    }

    const onPrevPage = () => {
      setCurrentPage(currentPage-1);
    }

    const reorder = (
        list,
        startIndex,
        endIndex
      ) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
    
        return result;
    };
    
    const onDragEnd = (result) => {
        const { source, destination } = result;
    
        // dropped outside the list
        if (!result.destination) {
          return;
        }
    
        const sInd = source.droppableId;
        const dInd = destination?.droppableId;
    
        // REORDER: if source and destination droppable ids are same
        if (dInd && sInd === dInd) {
          const column = columnData[sInd];
          const reorderedItems = reorder(
            column.items,
            source.index,
            destination.index
          );
    
          setColumnData({
            ...columnData,
            [dInd]: {
              ...column,
              items: reorderedItems,
            },
          });
        }
    
        // DROP: if source and destination droppable ids are different
        if (dInd && dInd !== sInd) {
          const sourceColumn = columnData[sInd];
          const desColumn = columnData[dInd];
    
          const itemToDrop = sourceColumn.items.find(
            (item) => item.id.toString() == result.draggableId
          );
    
          //INSERT: dragged item to another column
          if (itemToDrop) {
            const sourceColumnItems = Array.from(sourceColumn.items);
            const destColumnItems = Array.from(desColumn.items);
    
            sourceColumnItems.splice(result.source.index, 1);
            destColumnItems.splice(result.destination.index, 0, itemToDrop);
    
            setColumnData({
              ...columnData,
              [sInd]: {
                ...sourceColumn,
                items: sourceColumnItems,
              },
              [dInd]: {
                ...desColumn,
                items: destColumnItems,
              },
            });
          }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        navigate("/login");
    }
    
    return (
        <div className="w-full min-h-screen bg-gray-100 text-gray-600 font-light dashboard">
            <Modal modalOpen={modal} closeModal={() => showModal(!modal)} />
            <div className="flex justify-center lg:w-6/12 w-full mx-auto lg:px-0 px-4">
                <div className="dashboard-container w-full">                    
                    <div className="mx-auto flex justfy-center mt-2">
                      <button className="text-center mx-auto text-gray-800 font-semibold" onClick={handleLogout}>
                        Log out
                      </button>
                    </div>
                    <div className="flex justify-end mt-8">
                        <button className="flex items-center py-2 px-4 rounded-lg border-2 text-[15px] transition-all duration-500 ease-in-out hover:bg-black hover:text-white" onClick={() => showModal(true)}>
                            <span className="mr-2">+</span>
                            Add Task
                        </button>
                    </div>
                    {!isLoading ? (
                      <DragDropContext onDragEnd={onDragEnd}>
                        <div className="flex lg:flex-row flex-col gap-x-6 mt-8">
                            {Object.entries(columnData).map(([id, column]) => (
                                <Droppable droppableId={id} key={id}>
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="lg:w-1/2 w-full mb-4 lg:mb-1">
                                        <div className="w-full">
                                            <ItemsColumn
                                                columnTitle={column.title}
                                                items={column.items}
                                            />
                                        </div>
                                        {provided.placeholder}
                                    </div>
                                )}
                                </Droppable>
                            ))}
                        </div>
                    </DragDropContext>
                    ) : <Loader className="inline-block mr-2 animate-spin text-blue-500 w-6 h-6" />}
                </div>
            </div>
            <div className="w-6/12 flex mx-auto lg:flex-row flex-col items-center lg:justify-between mt-4 mb-4">
              <span className="text-sm text-gray-700 dark:text-gray-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> to <span className="font-semibold text-gray-900 dark:text-white">{data?.data?.pagination?.totalPages}</span> of <span className="font-semibold text-gray-900 dark:text-white">{data?.data?.pagination?.totalItems}</span> Entries
              </span>
              <div className="inline-flex mt-2 xs:mt-0">
                <button className="flex items-center justify-center px-4 h-10 me-3 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700" onClick={onPrevPage} disabled={!data?.data?.pagination?.hasPreviousPage}>
                    <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                    </svg>
                    Previous
                </button>
                <button className="flex items-center justify-center px-4 h-10 text-base font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700" onClick={onNextPage} disabled={!data?.data?.pagination?.hasNextPage}>
                    Next
                    <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                  </svg>
                </button>
              </div>
            </div>
        </div>
    )
}

export default Dashboard;
