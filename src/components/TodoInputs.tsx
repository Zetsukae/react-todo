import './styles/TodoInputs.css';

const TodoInputs = () => {
    return (
        <section className="todo-inputs">
            <form>
                <input type="text" placeholder="Add a new task" />
                <input type="date" />
                <button type="submit" className="add-button">
                    <img src="/icons/components/plus.svg" alt="Add" />
                </button>
                <textarea placeholder="Add a description to your task * optional *" />
            </form>
        </section>
    )
}

export default TodoInputs;