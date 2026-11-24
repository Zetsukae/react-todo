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
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        statusFilter={statusFilter}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                        onDeleted={onDeleted}
                    />
                ))}
            </ul>
            {visibleTodos.length > 0 && (
                <button className="delete-all-button">Delete All</button>
            )}
        </section>
    );
};

export default TodoList;