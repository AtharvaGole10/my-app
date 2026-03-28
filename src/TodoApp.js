import { useState } from "react"

export default function TodoApp() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState("")

  const addTodo = () => {
    if (input.trim() === "") return
    setTodos([...todos, { task: input, done: false }])
    setInput("")
  }

  const toggleTodo = (index) => {
    const updated = todos.map((todo, i) =>
      i === index ? { ...todo, done: !todo.done } : todo
    )
    setTodos(updated)
  }

  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index))
  }

  const handleKey = (e) => {
    if (e.key === "Enter") addTodo()
  }

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", padding: "24px",
      fontFamily: "sans-serif" }}>

      <h1 style={{ fontSize: "40px", marginBottom: "8px" }}>
        TODO LIST
      </h1>
      <p style={{ color: "#888", marginBottom: "24px" }}>
        {todos.filter(t => !t.done).length} tasks remaining
      </p>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Add a task..."
          style={{ flex: 1, padding: "10px 14px", borderRadius: "8px",
            border: "1px solid #ddd", fontSize: "14px" }}
        />
        <button
          onClick={addTodo}
          style={{ padding: "10px 18px", borderRadius: "8px",
            background: "#7F77DD", color: "white",
            border: "none", cursor: "pointer", fontSize: "14px" }}
        >
          Add
        </button>
      </div>

      {todos.map((todo, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center",
          gap: "12px", padding: "12px", marginBottom: "8px",
          borderRadius: "8px", border: "1px solid #eee",
          background: todo.done ? "#f9f9f9" : "white" }}>

          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => toggleTodo(index)}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />

          <span style={{ flex: 1, fontSize: "14px",
            textDecoration: todo.done ? "line-through" : "none",
            color: todo.done ? "#aaa" : "#333" }}>
            {todo.task}
          </span>

          <button
            onClick={() => deleteTodo(index)}
            style={{ background: "none", border: "none",
              color: "#ff4444", cursor: "pointer", fontSize: "16px" }}
          >
            ✕
          </button>
        </div>
      ))}

      {todos.length === 0 && (
        <p style={{ textAlign: "center", color: "#bbb", marginTop: "40px" }}>
          No tasks yet. Add one above!
        </p>
      )}
    </div>
  )
}