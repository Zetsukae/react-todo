export type Todo = {
    id: number;
    title: string;
    dueDate: string;
    completed: boolean;
};

type TodoItemProps = {
    todo: Todo;
};

const TodoItem = ({ todo }: TodoItemProps) => {
    return (
        <li className="todo-item">
            <input type="checkbox" checked={todo.completed} readOnly />
            <div className="due-date">{todo.dueDate}</div>
            <span>{todo.title}</span>
            <button className="edit-button">Edit</button>
            <button className="delete-button">Delete</button>
        </li>
    );
};

export default TodoItem;