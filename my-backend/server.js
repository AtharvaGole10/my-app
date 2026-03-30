const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

// Your todos stored in memory
let todos = []

// GET — fetch all todos
app.get("/todos", (req, res) => {
  res.json(todos)
})

// POST — add a new todo
app.post("/todos", (req, res) => {
  const todo = { id: Date.now(), task: req.body.task, done: false }
  todos.push(todo)
  res.json(todo)
})

// DELETE — remove a todo
app.delete("/todos/:id", (req, res) => {
  todos = todos.filter(t => t.id !== Number(req.params.id))
  res.json({ message: "Deleted!" })
})

// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000")
})