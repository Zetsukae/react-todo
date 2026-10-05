import './styles/TodoMessage.css';

// For now this component is static, if needed in the future it can be enhanced to accept props for dynamic messages and types (error, success, info, etc.)
const TodoMessage = () => {
    return (
        <div className="todo-message">
            <h2>Error</h2>
            <p>An error occurred while fetching todos.</p>
        </div>
    );
};

export default TodoMessage;