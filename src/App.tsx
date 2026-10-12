import { useEffect, useState } from 'react';
import './App.css';

import TodoInputs from './components/TodoInputs';
import TodoList from './components/TodoList';
import TodoSorts from './components/TodoSorts';
import { getTodos } from './api/services/todoService';
import type { TodoList as TodoItems } from './api/types/todo';

const App = () => {
  const [todos, setTodos] = useState<TodoItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const loadTodos = async () => {
      try {
        setTodos(await getTodos(controller.signal));
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Error fetching todos:', error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };
    void loadTodos();
    return () => controller.abort();
  }, []);

  return (
    <div className="content">
      <h1>React*Todo</h1>
      <section className="todo-container">
        <TodoInputs />
        <TodoSorts />
        {isLoading ? (
          <div className="loader" role="status" aria-label="Loading todos" />
        ) : todos ? (
          <TodoList todos={todos} />
        ) : null}
      </section>
    </div>
  );
};

export default App;
