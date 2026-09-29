const TodoInputs = () => {
    return (
        <section className="todo-inputs">
          <form>
              <input type="text" placeholder="Add a new todo..." />
              <input type="date" />
              <button type="submit" className="add-button">Add</button>
              </form>
        </section>
    )
}

export default TodoInputs;