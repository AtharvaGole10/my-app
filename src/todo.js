const todos = []

const addTodo = (task) => {
    todos.push({task,done:false})
    console.log(`added:${task}`)
}

const completeTodo = (index) => {
    todos[index].done =true 
    console.log(`Done : ${todos[index].task}`)
}

const showTodos = () => {
    todos.forEach((todo, i) => {
      const status = todo.done ? "✓" : "○"
      console.log(`${i}. ${status} ${todo.task}`)
    })
  }

addTodo("Learn Javascript")
addTodo("Build React App")
addTodo("Push to Github")
completeTodo(2)
showTodos()
