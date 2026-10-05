import { Component, Suspense, use, type ReactNode } from 'react';
import './App.css';

import TodoInputs from './components/TodoInputs';
import TodoList from './components/TodoList';
import TodoSorts from './components/TodoSorts';
import { getTodos } from './api/services/todoService';
import TodoMessage from './components/TodoMessage';

const todosPromise = getTodos();

const TodoListContent = () => {
  const todos = use(todosPromise);
  return <TodoList todos={todos} />;
};

class TodoErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <TodoMessage />;
    }

    return this.props.children;
  }
}

const App = () => {
  return (
    <div className="content">
      <h1>React*Todo</h1>
      <section className="todo-container">
        <TodoInputs />
        <TodoSorts />
        <TodoErrorBoundary>
          <Suspense fallback={<div className="loader" role="status" aria-label="Loading todos" />}>
            <TodoListContent />
          </Suspense>
        </TodoErrorBoundary>
      </section>
    </div>
  );
};

export default App;
