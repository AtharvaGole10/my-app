import { useState, useEffect } from "react"
import { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "./firebase"

export default function TodoApp() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState("")

  // Load todos from Firebase on startup
  useEffect(() => {
    const fetchTodos = async () => {
      const snapshot = await getDocs(collection(db, "todos"))
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      setTodos(data)
    }
    fetchTodos()
  }, [])

  // Add todo to Firebase
  const addTodo = async () => {
    if (input.trim() === "") return
    const docRef = await addDoc(collection(db, "todos"), {
      task: input,
      done: false
    })
    setTodos([...todos, { id: docRef.id, task: input, done: false }])
    setInput("")
  }

  // Delete todo from Firebase
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id))
    setTodos(todos.filter(t => t.id !== id))
  }

  // Toggle done — saves to Firebase
const toggleTodo = async (id, currentDone) => {
    const todoRef = doc(db, "todos", id)
    await updateDoc(todoRef, { done: !currentDone })
    setTodos(todos.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ))
  }

  const handleKey = (e) => {
    if (e.key === "Enter") addTodo()
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-6">

        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          My Todo List
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          {todos.filter(t => !t.done).length} tasks remaining
        </p>

        <div className="flex gap-2 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Add a task..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={addTodo}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Add
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition"
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id, todo.done)}
                className="w-4 h-4 accent-purple-500 cursor-pointer"
              />
              <span className={`flex-1 text-sm ${todo.done ? "line-through text-gray-300" : "text-gray-700"}`}>
                {todo.task}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-gray-300 hover:text-red-400 transition text-lg"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {todos.length === 0 && (
          <p className="text-center text-gray-300 text-sm mt-8">
            No tasks yet. Add one above!
          </p>
        )}

      </div>
    </div>
  )
}