import { FaCheckCircle, FaPencilAlt, FaRegCircle, FaTrashAlt } from "react-icons/fa"
import { ITask } from "../App"
import { KeyboardEvent, useState } from "react"
import { PiUploadSimple } from "react-icons/pi"
import axios from "../utils/axios"
import { isAxiosError } from "axios"

interface IProps {
  item: ITask
  listIdx: number
  setTasks: (param: ITask[]) => void
}

export default function ListTask({ item, listIdx, setTasks }: IProps) {
  const [editedTask, setEditedTask] = useState<string>(item.task)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const getData = async () => {
    try {
      const { data } = await axios.get("/tasks")
      setTasks(data.result)
    } catch (err) {
      if (isAxiosError(err)) {
        console.log(err.response?.data.error)
      }
    }
  }

  const handleCheck = async () => {
    try {
      const { data } = await axios.patch(`/tasks/check/${listIdx}`)
      console.log(data.message)
      getData()
    } catch (err) {
      if (isAxiosError(err)) {
        console.log(err.response?.data.error)
      }
    }
  }

  const handleDeleteTask = async () => {
    try {
      const { data } = await axios.delete(`/tasks/${listIdx}`)
      console.log(data.message)
      getData()
    } catch (err) {
      if (isAxiosError(err)) {
        console.log(err.response?.data.error)
      }
    }
  }

  const handleConfirmEdit = async () => {
    if (editedTask !== '') {
      try {
        const { data } = await axios.patch(`/tasks/${listIdx}`, { task: editedTask })
        console.log(data.message)
        getData()
      } catch (err) {
        if (isAxiosError(err)) {
          console.log(err.response?.data.errors)
        }
      } finally {
        setIsEditing(!isEditing)
      }
    }
  }

  const handleEnterEdit = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirmEdit()
    }
  }

  return (
    <li className="flex justify-between gap-4">
      <div className="flex items-center gap-2 flex-1">
        <button className="cursor-pointer" onClick={handleCheck}>
          {item.isChecked ? (
            <FaCheckCircle className="text-green-400" />
          ) : (
            <FaRegCircle className="text-white hover:text-green-400" />
          )}
        </button>
        {!isEditing ? (
          <p className={`${item.isChecked && "line-through"} text-white pb-1`}>{item.task}</p>
        ) : (
          <input
            type="text"
            value={editedTask}
            onKeyDown={handleEnterEdit}
            onChange={(e) => setEditedTask(e.target.value)}
            className="outline-none pb-[3px] border-b-white text-white border-b w-full"
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <button className="cursor-pointer" onClick={handleConfirmEdit}>
            <PiUploadSimple className="text-blue-300 hover:text-blue-400" />
          </button>
        ) : (
          <button className="cursor-pointer" onClick={() => setIsEditing(!isEditing)}>
            <FaPencilAlt className="text-blue-300 hover:text-blue-400" />
          </button>
        )}
        <button className="cursor-pointer" onClick={handleDeleteTask}>
          <FaTrashAlt className="text-red-500 hover:text-red-400" />
        </button>
      </div>
    </li>
  )
}