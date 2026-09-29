import TodoItem from './TodoItem';
import type { Todo } from './TodoItem';
import './styles/TodoList.css';

const TodoList = ({ todos }: { todos: Todo[] }) => {
    return (
        <section className="todo-list">
            <ul>
                {todos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                ))}
            </ul>
            <button className="delete-all-button">
                Delete All
            </button>
        </section>
    );
};

export default TodoList;