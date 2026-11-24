import { useEffect, useMemo, useState } from 'react';
import './App.css';

import TodoInputs from './components/TodoInputs';
import TodoList from './components/TodoList';
import TodoSorts from './components/TodoSorts';
import type { TodoSortOrder, TodoStatusFilter } from './components/TodoSorts';
import { createTodo, deleteTodo, getTodos, updateTodo } from './api/services/todoService';
import type { Todo, TodoCreate, TodoList as TodoItems, TodoUpdate } from './api/types/todo';

const App = () => {
  const [todos, setTodos] = useState<TodoItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TodoStatusFilter>('all');
  const [sortOrder, setSortOrder] = useState<TodoSortOrder>('default');

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

  const handleDeleteTodo = async (id: number): Promise<void> => {
    await deleteTodo(id);
    setTodos((currentTodos) => currentTodos?.filter((todo) => todo.id !== id) ?? null);
  };

  const handleUpdateTodo = async (id: number, changes: TodoUpdate): Promise<void> => {
    const updatedTodo = await updateTodo(id, changes);
    setTodos((currentTodos) =>
      currentTodos?.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)) ?? null,
    );
  };

  const handleTodoDeleted = (id: number) => {
    setTodos((currentTodos) => currentTodos?.filter((todo) => todo.id !== id) ?? null);
  };

  const sortedTodos = useMemo(() => {
    return [...(todos ?? [])].sort((first, second) => {
      if (sortOrder === 'name') {
        return first.title.localeCompare(second.title, undefined, { sensitivity: 'base' });
      }
      if (sortOrder === 'due-date') {
        if (!first.due_date) {
          return second.due_date ? 1 : 0;
        }
        if (!second.due_date) {
          return -1;
        }
        return first.due_date.localeCompare(second.due_date);
      }
      return 0;
    });
  }, [todos, sortOrder]);

  return (
    <>
      <div className="app-background" aria-hidden="true">
        <div className="squares">
          {Array.from({ length: 10 }, (_, index) => (
            <span className="square" key={index} />
          ))}
        </div>
      </div>
      <main className="content">
        <h1>React*Todo</h1>
        <section className="todo-container">
          <TodoInputs onCreate={handleCreateTodo} />
          <TodoSorts
            statusFilter={statusFilter}
            sortOrder={sortOrder}
            onStatusFilterChange={setStatusFilter}
            onSortOrderChange={setSortOrder}
          />
          {isLoading ? (
            <div className="loader" role="status" aria-label="Loading todos" />
          ) : todos ? (
            <TodoList
              todos={sortedTodos}
              statusFilter={statusFilter}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
              onDeleted={handleTodoDeleted}
            />
          ) : null}
        </section>
      </main>
    </>
  );
};

export default App;
