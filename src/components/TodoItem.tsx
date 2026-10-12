import './styles/TodoItem.css';
import type { Todo } from '../api/types/todo';

const TodoItem = ({ todo }: { todo: Todo }) => {
    return (
        <li className="todo-item">
            <input type="checkbox" checked={todo.done} readOnly />
            <div className="due-date">{todo.due_date}</div>
            <div className="todo-content">
                <span>{todo.title}</span>
                {todo.content && <p>{todo.content}</p>}
            </div>
            <button className="delete-button item-button">
                <img src="icons/components/delete.svg" alt="Delete" />
            </button>
        </li>
    );
};

export default TodoItem;