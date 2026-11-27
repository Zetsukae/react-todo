import { useEffect } from 'react';
import './App.css';

import TodoInputs from './components/TodoInputs';
import TodoList from './components/TodoList';
import TodoSorts from './components/TodoSorts';
import ErrorMessage from './components/ErrorMessage';
import {
  useErrorMessage,
  useIsLoadingTodos,
  useTodoStore,
  useTodos,
} from './store/todoStore';

const App = () => {
  const todos = useTodos();
  const isLoading = useIsLoadingTodos();
  const errorMessage = useErrorMessage();
  const fetchTodos = useTodoStore((state) => state.fetchTodos);
  const dismissError = useTodoStore((state) => state.dismissError);

  useEffect(() => {
    const controller = new AbortController();
    void fetchTodos(controller.signal);
    return () => controller.abort();
  }, [fetchTodos]);

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
        <ErrorMessage message={errorMessage} onDismiss={dismissError} />
        <h1>React*Todo</h1>
        <section className="todo-container">
          <TodoInputs />
          <TodoSorts />
          {isLoading ? (
            <div className="loader" role="status" aria-label="Loading todos" />
          ) : todos ? (
            <TodoList />
          ) : null}
        </section>
      </main>
    </>
  );
};

export default App;
