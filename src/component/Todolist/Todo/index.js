import React, { useState, useRef } from "react"

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner"
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit"
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash"
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck"

// Todo
const Todo = ({ task, refreshTodos, loading }) => {
  const [editMode, setEditMode] = useState(false)
  const [updating, setUpdating] = useState(false)

  const [deleting, setDeleting] = useState(false)
  const [taskToUpdate, setTaskToUpdate] = useState(task)
  const inputEl = useRef(null)
  // Handlers
  const handleChange = e => {
    setTaskToUpdate({ ...task, text: e.target.value })
  }
  const handleEdit = () => {
    setEditMode(true)
    inputEl.current.focus() // Focus the input field
  }

  const handleDelete = () => {
    setDeleting(true)
    deleteTodo()
  }

  // Functions
  const updateTodo = async () => {
    try {
      setUpdating(true)
      await fetch("/.netlify/functions/updateTodo", {
        method: "PUT",
        body: JSON.stringify(taskToUpdate),
      })
      setUpdating(false)
      setEditMode(false)
    } catch (error) {
      console.error("Error occured: ", error)
    }
  }
  const deleteTodo = async () => {
    const id = task._id
    try {
      await fetch("/.netlify/functions/deleteTodo", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      })
      refreshTodos()
      setDeleting(false)
    } catch (error) {
      console.error("Error occured: ", error)
    }
  }
  // Sub Components
  const editButton = editMode ? (
    updating ? (
      <a className="text-blue-500 flex items-center text-base p-1 hover:text-blue-900 cursor-pointer">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          className="align-middle text-lg"
        />
      </a>
    ) : (
      <a
        onClick={updateTodo}
        className="text-blue-500 flex items-center text-base p-1 hover:text-blue-900 cursor-pointer"
      >
        <FontAwesomeIcon icon={faCheck} className="align-middle text-lg" />
      </a>
    )
  ) : (
    <a
      onClick={handleEdit}
      className="text-blue-500 flex items-center text-base p-1 hover:text-blue-900 cursor-pointer"
    >
      <FontAwesomeIcon icon={faEdit} className="align-middle text-lg" />
    </a>
  )

  const todoText = editMode ? (
    <input
      className="text-sm text w-full px-2 ml-2 font-medium  focus:ring focus:border-blue-300 overflow-scroll  font-medium outline-none text-gray-900"
      value={taskToUpdate.text}
      onChange={handleChange}
      ref={inputEl}
    />
  ) : (
    <input
      className="text-sm px-2 w-full  ml-2 font-mediumcursor-default font-medium overflow-scroll overflow-scroll  outline-none text-gray-900"
      value={taskToUpdate.text}
      onChange={handleChange}
      readOnly
      ref={inputEl}
    />
  )

      // Delete Button
  const deleteButton = deleting ? (
    <a className="text-blue-500 flex items-center text-base p-1 hover:text-blue-900 cursor-pointer">
      <FontAwesomeIcon
        icon={faSpinner}
        spin
        className="align-middle ml-2 text-lg"
      />
    </a>
  ) : (
    <a
      onClick={handleDelete}
      className="text-blue-500 flex items-center text-base p-1 hover:text-blue-900 cursor-pointer"
    >
      <FontAwesomeIcon icon={faTrash} className="align-middle ml-2 text-lg" />
    </a>
  )


  // Return
  return (
    <div className="flex flex-col">
      <div className="-my-2 flex align-center sm:-mx-6 lg:-mx-8 ">
        <div className="py-2 align-middle inline-block lg:w-2/3 mx-auto  w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden  border-b border-gray-200 sm:rounded-lg">
            <div className="min-w-5/6  divide-y divide-gray-200">
              <div className="bg-white divide-y divide-gray-200">
                {/* Container */}
                <div className="px-2 min-w-full py-4 flex justify-between align-center ">
                  {todoText}
                  {/* Buttons */}
                  <div className="inline-block flex justify-end items-center min-w-48 w-36 ">
                    {editButton}
                    {deleteButton}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Todo