import './App.css';

import TodoInputs from './components/TodoInputs';
import TodoList from './components/TodoList';
import TodoSorts from './components/TodoSorts';
import type { Todo } from './components/TodoItem';

const todos: Todo[] = [
  { id: 1, title: 'Create the component structure', dueDate: '2026-09-30', completed: true },
];

const App = () => {
  return (
    <div className="content">
      <h1>React*Todo</h1>
      <section className="todo-container">
        <TodoInputs />
        <TodoSorts />
        <TodoList todos={todos} />
      </section>
    </div>
  );
};

export default App;
