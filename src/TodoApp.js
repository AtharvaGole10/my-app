import { useState, useEffect } from "react"
import { db, auth, googleProvider, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, signInWithPopup, signOut } from "./firebase"
import { onAuthStateChanged } from "firebase/auth"
import { query, where } from "firebase/firestore"

export default function TodoApp() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState("")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // Load todos when user logs in
  useEffect(() => {
    if (!user) return
    const fetchTodos = async () => {
      const q = query(collection(db, "todos"), where("uid", "==", user.uid))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      setTodos(data)
    }
    fetchTodos()
  }, [user])

  // Google login
  const login = async () => {
    await signInWithPopup(auth, googleProvider)
  }

  // Logout
  const logout = async () => {
    await signOut(auth)
    setTodos([])
  }

  // Add todo
  const addTodo = async () => {
    if (input.trim() === "") return
    const docRef = await addDoc(collection(db, "todos"), {
      task: input,
      done: false,
      uid: user.uid
    })
    setTodos([...todos, { id: docRef.id, task: input, done: false }])
    setInput("")
  }

  // Delete todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id))
    setTodos(todos.filter(t => t.id !== id))
  }

  // Toggle todo
  const toggleTodo = async (id, currentDone) => {
    await updateDoc(doc(db, "todos", id), { done: !currentDone })
    setTodos(todos.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ))
  }

  const handleKey = (e) => {
    if (e.key === "Enter") addTodo()
  }

  // Loading screen
  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading...</p>
    </div>
  )

  // Login screen
  if (!user) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">My Todo List</h1>
        <p className="text-sm text-gray-400 mb-8">Sign in to access your todos</p>
        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          Sign in with Google
        </button>
      </div>
    </div>
  )

  // Main app
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-6">

        {/* Header with user info */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">My Todo List</h1>
            <p className="text-sm text-gray-400">
              {todos.filter(t => !t.done).length} tasks remaining
            </p>
          </div>
          <div className="flex items-center gap-2">
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-8 h-8 rounded-full"
            />
            <button
              onClick={logout}
              className="text-xs text-gray-400 hover:text-red-400 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Input row */}
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

        {/* Todo list */}
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