const TodoInputs = () => {
    return (
        <section className="todo-inputs">
            <input type="text" placeholder="Add a new todo..." />
            <input type="date" />
            <button className="add-button">Add</button>
        </section>
    )
}

export default TodoInputs;