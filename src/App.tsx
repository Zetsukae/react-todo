import { useEffect, useState } from 'react';
import './App.css';

import TodoInputs from './components/TodoInputs';
import TodoList from './components/TodoList';
import TodoSorts from './components/TodoSorts';
import { createTodo, getTodos } from './api/services/todoService';
import type { Todo, TodoCreate, TodoList as TodoItems } from './api/types/todo';

const App = () => {
  const [todos, setTodos] = useState<TodoItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos(controller.signal);
        setTodos((currentTodos) => {
          if (!currentTodos) {
            return loadedTodos;
          }
          const loadedIds = new Set(loadedTodos.map((todo) => todo.id));
          return [...loadedTodos, ...currentTodos.filter((todo) => !loadedIds.has(todo.id))];
        });
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

  const handleCreateTodo = async (todo: TodoCreate): Promise<Todo> => {
    const createdTodo = await createTodo(todo);
    setTodos((currentTodos) => {
      const existingTodos = currentTodos ?? [];
      return existingTodos.some((todo) => todo.id === createdTodo.id)
        ? existingTodos
        : [...existingTodos, createdTodo];
    });
    return createdTodo;
  };

  return (
    <div className="content">
      <h1>React*Todo</h1>
      <section className="todo-container">
        <TodoInputs onCreate={handleCreateTodo} />
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
