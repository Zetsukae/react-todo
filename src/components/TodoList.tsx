import TodoItem from './TodoItem';
import type { Todo } from './TodoItem';

const TodoList = ({ todos }: { todos: Todo[] }) => {
    return (
        <section className="todo-list">
            <ul>
                {todos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                ))}
            </ul>
        </section>
    );
};

export default TodoList;