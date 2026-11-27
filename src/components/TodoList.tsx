import { useMemo } from 'react';
import TodoItem from './TodoItem';
import type { TodoList as TodoItems } from '../api/types/todo';
import './styles/TodoList.css';
import type { TodoSortOrder } from '../store/filterStore';
import { useSortOrder, useStatusFilter } from '../store/filterStore';
import { useTodos } from '../store/todoStore';

const sortTodos = (todos: TodoItems, sortOrder: TodoSortOrder): TodoItems =>
  [...todos].sort((first, second) => {
    if (sortOrder === 'name') {
      return first.title.localeCompare(second.title, undefined, {
        sensitivity: 'base',
      });
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

const TodoList = () => {
  const storedTodos = useTodos();
  const statusFilter = useStatusFilter();
  const sortOrder = useSortOrder();
  const todos = useMemo(
    () => sortTodos(storedTodos ?? [], sortOrder),
    [storedTodos, sortOrder],
  );

  const visibleTodos = todos.filter((todo) => {
    if (statusFilter === 'done') {
      return todo.done;
    }
    if (statusFilter === 'undone') {
      return !todo.done;
    }
    return true;
  });
  const emptyMessage = {
    all: 'No tasks yet.',
    done: 'No completed tasks.',
    undone: 'No undone tasks.',
  }[statusFilter];

  return (
    <section className="todo-list">
      <ul>
        {visibleTodos.length === 0 && (
          <li className="empty-state">{emptyMessage}</li>
        )}
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
      {visibleTodos.length > 0 && (
        <button className="delete-all-button">Delete All</button>
      )}
    </section>
  );
};

export default TodoList;
