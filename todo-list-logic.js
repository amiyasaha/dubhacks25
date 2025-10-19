"use client"; // If using Next.js 13+ app directory

import { useState } from "react";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  // Add a new todo
  const addTodo = () => {
    if (input.trim() === "") return;
    setTodos([...todos, { text: input.trim(), completed: false }]);
    setInput("");
  };

  // Toggle completed status
  const toggleComplete = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded mr-2"
          placeholder="Add a todo"
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul>
        {todos.map((todo, index) => (
          <li
            key={index}
            onClick={() => toggleComplete(index)}
            className={`p-2 border-b cursor-pointer ${
              todo.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
