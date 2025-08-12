import { useState, useEffect } from "react";
import "./App.css";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  // ローカルストレージからTODOを読み込み
  useEffect(() => {
    const savedTodos = localStorage.getItem("today-todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // TODOをローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("today-todos", JSON.stringify(todos));
  }, [todos]);

  // 新しいTODOを追加
  const addTodo = () => {
    if (newTodo.trim() && todos.length < 3) {
      const todo: Todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
      };
      setTodos([...todos, todo]);
      setNewTodo("");
    }
  };

  // TODOの完了状態を切り替え
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // TODOを削除
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 全てのTODOを削除
  const clearAll = () => {
    setTodos([]);
  };

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>今日のTODO</h1>
          <p className="subtitle">今日は3つのタスクに集中しましょう</p>
        </header>

        <div className="progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(completedCount / 3) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">{completedCount}/3 完了</span>
        </div>

        <div className="add-todo">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            placeholder="新しいタスクを入力..."
            disabled={todos.length >= 3}
            className="todo-input"
          />
          <button
            onClick={addTodo}
            disabled={!newTodo.trim() || todos.length >= 3}
            className="add-button"
          >
            追加
          </button>
        </div>

        <div className="todos">
          {todos.length === 0 ? (
            <div className="empty-state">
              <p>今日のTODOを追加してください</p>
              <p className="hint">最大3つまで追加できます</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <span className="todo-text">{todo.text}</span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-button"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <button onClick={clearAll} className="clear-button">
            全て削除
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
