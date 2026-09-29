import { useState } from 'react';
import './styles/TodoItem.css';
import type { Todo } from '../api/types/todo';

const TodoItem = ({
    todo,
    onDelete,
    onDeleted,
}: {
    todo: Todo;
    onDelete: (id: number) => Promise<void>;
    onDeleted: (id: number) => void;
}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleDelete = async () => {
        setIsPending(true);
        try {
            await onDelete(todo.id);
            setIsDeleting(true);
        } catch {
            setIsPending(false);
        }
    };

    return (
        <li
            className={`todo-item${isDeleting ? ' todo-item--deleting' : ''}`}
            onAnimationEnd={(event) => {
                if (isDeleting && event.animationName === 'todo-item-exit') {
                    onDeleted(todo.id);
                }
            }}
        >
            <label>
                <input type="checkbox" checked={todo.done} readOnly />
                {todo.due_date && <div className="due-date">{todo.due_date}</div>}
                <div className="todo-content">
                    <span>{todo.title}</span>
                    {todo.content && <p>{todo.content}</p>}
                </div>
            </label>
            <button className="delete-button item-button" onClick={() => void handleDelete()} disabled={isPending}>
                <img src="icons/components/delete.svg" alt="Delete" />
            </button>
        </li>
    );
};

export default TodoItem;