import { Suspense, use } from 'react';
import './App.css';

import TodoInputs from './components/TodoInputs';
import TodoList from './components/TodoList';
import TodoSorts from './components/TodoSorts';
import { getTodos } from './api/services/todoService';

const todosPromise = getTodos();

const TodoListContent = () => {
  const todos = use(todosPromise);
  return <TodoList todos={todos} />;
};

const App = () => {
  return (
    <div className="content">
      <h1>React*Todo</h1>
      <section className="todo-container">
        <TodoInputs />
        <TodoSorts />
        <Suspense fallback={<div className="loader" role="status" aria-label="Loading todos" />}>
          <TodoListContent />
        </Suspense>
      </section>
    </div>
  );
};

export default App;
