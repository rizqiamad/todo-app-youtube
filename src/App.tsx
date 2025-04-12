import { KeyboardEvent, useEffect, useState } from "react"
import ListTask from "./components/ListTask"
import axios from "./utils/axios"
import { isAxiosError } from "axios"

export interface ITask {
  id: string
  task: string
  isChecked: boolean
}

export default function App() {
  const [tasks, setTasks] = useState<ITask[]>([])
  const [currentTask, setCurrentTask] = useState<string>("")

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

  const handleAddTask = async () => {
    if (currentTask !== '') {
      try {
        const { data } = await axios.post("/tasks", { task: currentTask, isChecked: false })
        console.log(data.message)
        getData()
      } catch (err) {
        if (isAxiosError(err)) {
          console.log(err.response?.data.errors)
        }
      }
      setCurrentTask("")
    }
  }

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTask()
    }
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <main className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
      <section className="rounded-xl py-10 px-6 border border-white/30 bg-white/20 backdrop-blur-md shadow-xl w-[30rem]">
        <h1 className="text-2xl font-semibold text-center text-white mb-2">Todo App</h1>
        <div className="flex gap-2 mb-2 w-full">
          <input
            type="text"
            value={currentTask}
            onKeyDown={handleEnter}
            onChange={(e) => setCurrentTask(e.target.value)}
            placeholder="Input your task"
            className="outline-none bg-white/20 rounded-md px-2 py-1 text-white/80 w-full"
          />
          <button
            onClick={handleAddTask}
            className="border border-white/30 px-2 cursor-pointer rounded-md text-white bg-orange-400 hover:bg-orange-500"
          >+</button>
        </div>
        <ul>
          {tasks.map((item, idx) => {
            return (
              <ListTask
                key={item.id}
                item={item}
                listIdx={idx}
                setTasks={setTasks}
              />
            )
          })}
        </ul>
      </section>
    </main>
  )
}