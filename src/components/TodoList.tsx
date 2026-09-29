import TodoItem from './TodoItem';
import type { Todo } from './TodoItem';

type TodoListProps = {
    todos: Todo[];
};

const TodoList = ({ todos }: TodoListProps) => {
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