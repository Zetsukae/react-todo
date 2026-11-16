import TodoItem from './TodoItem';
import type { TodoList as TodoItems, TodoUpdate } from '../api/types/todo';
import './styles/TodoList.css';
import type { TodoStatusFilter } from './TodoSorts';

type TodoListProps = {
    todos: TodoItems;
    statusFilter: TodoStatusFilter;
    onUpdate: (id: number, changes: TodoUpdate) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
    onDeleted: (id: number) => void;
};

const TodoList = ({ todos, statusFilter, onUpdate, onDelete, onDeleted }: TodoListProps) => {
    const emptyMessage = {
        all: 'No tasks yet.',
        done: 'No completed tasks.',
        undone: 'No undone tasks.',
    }[statusFilter];

    return (
        <section className="todo-list">
            <ul>
                {todos.length === 0 ? (
                    <li className="empty-state">{emptyMessage}</li>
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