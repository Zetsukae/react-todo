import TodoItem from './TodoItem';
import type { TodoList as TodoItems, TodoUpdate } from '../api/types/todo';
import './styles/TodoList.css';

type TodoListProps = {
    todos: TodoItems;
    onUpdate: (id: number, changes: TodoUpdate) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onDeleted: (id: number) => void;
};

const TodoList = ({ todos, onUpdate, onDelete, onDeleted }: TodoListProps) => {
    return (
        <section className="todo-list">
            <ul>
                {todos.length === 0 ? (
                    <li className="empty-state">No tasks to complete.</li>
                ) : (
                    todos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            onDeleted={onDeleted}
                        />
                    ))
                )}
            </ul>
            {todos.length > 0 && (
                <button className="delete-all-button">Delete All</button>
            )}
        </section>
    );
};

export default TodoList;