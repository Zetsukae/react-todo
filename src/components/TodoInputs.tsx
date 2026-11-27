import { useState } from 'react';
import type { SubmitEvent } from 'react';
import type { TodoCreate } from '../api/types/todo';
import { useTodoStore } from '../store/todoStore';
import './styles/TodoInputs.css';

const TodoInputs = () => {
  const createTodo = useTodoStore((state) => state.createTodo);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle || isSubmitting) {
      return;
    }

    const todo: TodoCreate = {
      title: trimmedTitle,
      ...(dueDate && { due_date: dueDate }),
      ...(description.trim() && { content: description.trim() }),
    };

    setIsSubmitting(true);
    if (await createTodo(todo)) {
      setTitle('');
      setDueDate('');
      setDescription('');
    }
    setIsSubmitting(false);
  };

  return (
    <section className="todo-inputs">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          aria-label="Title"
          placeholder="Add a new task"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          aria-label="Due date (optional)"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button
          type="submit"
          className="add-button"
          aria-label="Create"
          disabled={title.trim() === '' || isSubmitting}
        >
          <img src="icons/components/plus.svg" alt="" />
        </button>
        <textarea
          aria-label="Description (optional)"
          placeholder="Add a description to your task * optional *"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </form>
    </section>
  );
};

export default TodoInputs;
