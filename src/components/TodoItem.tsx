import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, SubmitEvent } from 'react';
import './styles/TodoItem.css';
import type { Todo, TodoUpdate } from '../api/types/todo';
import type { TodoStatusFilter } from './TodoSorts';

type TodoItemProps = {
  todo: Todo;
  statusFilter: TodoStatusFilter;
  onUpdate: (id: number, changes: TodoUpdate) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onDeleted: (id: number) => void;
  onError: (message: string) => void;
};

const formatDueDate = (dueDate: string): string => {
  const [year, month, day] = dueDate.split('-');
  return `${day}/${month}/${year.slice(-2)}`;
};

const TodoItem = ({
  todo,
  statusFilter,
  onUpdate,
  onDelete,
  onDeleted,
  onError,
}: TodoItemProps) => {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [content, setContent] = useState(todo.content ?? '');
  const [dueDate, setDueDate] = useState(todo.due_date ?? '');
  const [error, setError] = useState('');
  const editFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const handleOutsidePointerDown = (event: PointerEvent) => {
      const form = editFormRef.current;
      if (
        form &&
        event.target instanceof Element &&
        !form.contains(event.target) &&
        !event.target.closest('.error-message')
      ) {
        form.requestSubmit();
      }
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () =>
      document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, [isEditing]);

  const startEditing = () => {
    setTitle(todo.title);
    setContent(todo.content ?? '');
    setDueDate(todo.due_date ?? '');
    setError('');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setError('');
    setIsEditing(false);
  };

  const handleSave = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (isUpdating) {
      return;
    }
    if (!trimmedTitle) {
      setError('A todo title is required.');
      return;
    }

    setError('');
    setIsUpdating(true);
    try {
      await onUpdate(todo.id, {
        title: trimmedTitle,
        content: content.trim() || null,
        due_date: dueDate || null,
      });
      setIsEditing(false);
    } catch {
      onError('Unable to update task. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDoneChange = async (done: boolean) => {
    setIsUpdating(true);
    try {
      await onUpdate(todo.id, { done });
    } catch {
      onError('Unable to update task. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTodoContentClick = (event: MouseEvent<HTMLDivElement>) => {
    if (
      event.target === event.currentTarget &&
      !isPending &&
      !isUpdating &&
      !isDeleting
    ) {
      checkboxRef.current?.click();
    }
  };

  const handleDelete = async () => {
    setIsPending(true);
    try {
      await onDelete(todo.id);
      setIsDeleting(true);
    } catch {
      onError('Unable to delete task. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelEditing();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const matchesStatusFilter =
    statusFilter === 'all' ||
    (statusFilter === 'done' && todo.done) ||
    (statusFilter === 'undone' && !todo.done);
  if (!matchesStatusFilter && !isEditing) {
    return null;
  }

  return (
    <li
      className={`todo-item${todo.due_date || isEditing ? ' todo-item--has-due-date' : ''}${todo.done ? ' todo-item--done' : ''}${isEditing ? ' todo-item--editing' : ''}${isDeleting ? ' todo-item--deleting' : ''}`}
      onAnimationEnd={(event) => {
        if (isDeleting && event.animationName === 'todo-item-exit') {
          onDeleted(todo.id);
        }
      }}
    >
      <label className="todo-checkbox">
        <input
          ref={checkboxRef}
          type="checkbox"
          aria-label={`Mark "${todo.title}" as ${todo.done ? 'not done' : 'done'}`}
          checked={todo.done}
          onChange={(event) =>
            void handleDoneChange(event.currentTarget.checked)
          }
          disabled={isPending || isUpdating || isDeleting || isEditing}
        />
      </label>
      {isEditing ? (
        <form
          ref={editFormRef}
          className="todo-edit-form"
          onSubmit={(event) => void handleSave(event)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              cancelEditing();
            }
          }}
        >
          <div className="todo-edit-fields">
            <input
              className="todo-edit-date"
              type="date"
              aria-label="Due date"
              value={dueDate}
              onChange={(event) => setDueDate(event.currentTarget.value)}
              onKeyDown={handleEditKeyDown}
              disabled={isUpdating}
            />
            <div className="todo-edit-content">
              <input
                className="todo-edit-title"
                type="text"
                aria-label="Title"
                value={title}
                onChange={(event) => setTitle(event.currentTarget.value)}
                onKeyDown={handleEditKeyDown}
                required
                autoFocus
                disabled={isUpdating}
              />
              <textarea
                className="todo-edit-description"
                aria-label="Description"
                value={content}
                onChange={(event) => setContent(event.currentTarget.value)}
                placeholder="Add a description"
                disabled={isUpdating}
              />
            </div>
          </div>
          <div className="todo-edit-actions">
            <button
              type="submit"
              className="item-button confirm-button"
              aria-label="Save changes"
              disabled={isUpdating || isPending}
            >
              <img src="icons/components/confirm.svg" alt="" />
            </button>
            <button
              type="button"
              className="item-button cancel-button"
              aria-label="Cancel editing"
              onClick={cancelEditing}
              disabled={isUpdating || isPending}
            >
              <img src="icons/components/delete.svg" alt="" />
            </button>
          </div>
          {error && (
            <p className="todo-edit-error" role="alert">
              {error}
            </p>
          )}
        </form>
      ) : (
        <>
          <button
            type="button"
            className="due-date todo-edit-trigger"
            aria-label={
              todo.due_date ? `Edit due date: ${todo.due_date}` : 'Add due date'
            }
            onClick={startEditing}
            disabled={isPending || isUpdating || isDeleting}
          >
            {todo.due_date ? formatDueDate(todo.due_date) : 'Add date'}
          </button>
          <div className="todo-content" onClick={handleTodoContentClick}>
            <button
              type="button"
              className="todo-edit-trigger todo-title"
              onClick={startEditing}
              disabled={isPending || isUpdating || isDeleting}
            >
              {todo.title}
            </button>
            {todo.content && (
              <button
                type="button"
                className="todo-edit-trigger todo-description"
                onClick={startEditing}
                disabled={isPending || isUpdating || isDeleting}
              >
                {todo.content}
              </button>
            )}
          </div>
          <button
            type="button"
            className="delete-button item-button"
            aria-label="Delete todo"
            onClick={() => void handleDelete()}
            disabled={isPending || isUpdating || isDeleting}
          >
            <img src="icons/components/trash.svg" alt="" />
          </button>
        </>
      )}
    </li>
  );
};

export default TodoItem;
