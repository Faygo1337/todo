import React, { useState, useEffect } from "react";
import "./TodoApp.css";

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedFilter = localStorage.getItem("filter") as
      | "all"
      | "active"
      | "completed"
      | null;

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedFilter) {
      setFilter(savedFilter);
    }
  }, []);

  const addTask = () => {
    if (inputValue.trim()) {
      const newTasks = [...tasks, inputValue];
      updateTasks(newTasks);
      setInputValue("");
    }
  };

  const toggleTask = (index: number) => {
    if (filter === "all") {
      const newTasks = tasks.map((task, i) => 
        i === index ? (task.includes("✔️") ? task.replace("✔️", "") : `✔️ ${task}`) : task
      );
      updateTasks(newTasks);
    }
  };

  const clearCompleted = () => {
    const activeTasks = tasks.filter((task) => !task.includes("✔️"));
    updateTasks(activeTasks);
  };

  const updateTasks = (newTasks: string[]) => {
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.includes("✔️");
    if (filter === "completed") return task.includes("✔️");
    return true; 
  });

  const handleFilterChange = (newFilter: "all" | "active" | "completed") => {
    setFilter(newFilter);
    localStorage.setItem("filter", newFilter);
  };

  return (
    <div className="todo-app">
        <h1>todos</h1>

      <div className="todo-app__container">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
        />
        <ul>
          {filteredTasks.map((task, index) => (
            <li
              key={index}
              onClick={() => toggleTask(index)}
              className={task.includes("✔️") ? "completed" : ""}
            >
              <span
                className={`circle ${task.includes("✔️") ? "filled" : ""}`}
              ></span>
              {task.replace("✔️ ", "")}
            </li>
          ))}
        </ul>
        <div className="footer">
          <span>{tasks.length} items left</span>
          <div className="filters">
            {["all", "active", "completed"].map((f) => (
              <button
                key={f}
                className={filter === f ? "active" : ""}
                onClick={() => handleFilterChange(f as "all" | "active" | "completed")}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <button onClick={clearCompleted}>Clear completed</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
