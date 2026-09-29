import './App.css';

import TodoInputs from './components/TodoInputs';
import TodoList from './components/TodoList';
import TodoSorts from './components/TodoSorts';
import type { Todo } from './components/TodoItem';

const todos: Todo[] = [
  { id: 1, title: 'Create the component structure', due_date: '28/09/26', done: true },
  { id: 2, title: 'Implement a theme chooser', content: 'Create a theme chooser component, this will allow users to switch between different themes.', due_date: '29/09/26', done: false },
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
