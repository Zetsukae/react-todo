import TodoItem from './TodoItem';
import type { TodoList as TodoItems } from '../api/types/todo';
import './styles/TodoList.css';

const TodoList = ({ todos }: { todos: TodoItems }) => {
    return (
        <section className="todo-list">
            <ul>
                {todos.length === 0 ? (
                    <li className="empty-state">No tasks to complete.</li>
                ) : (
                    todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)
                )}
            </ul>
            {todos.length > 0 && (
                <button className="delete-all-button">Delete All</button>
            )}
        </section>
    );
};

export default TodoList;