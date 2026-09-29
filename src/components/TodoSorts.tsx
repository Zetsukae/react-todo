const TodoSorts = () => {
    return (
        <section className="todo-sorts">
            <p>Filter & Sort:</p>
            <label className="option">
                <input type="radio" name="status" value="all" checked />
                <span>All</span>
            </label>
            <label className="option">
                <input type="radio" name="status" value="done" />
                <span>Done</span>
            </label>
            <label className="option">
                <input type="radio" name="status" value="undone" />
                <span>Undone</span>
            </label>
            <label className="option">
                <input type="checkbox" name="sort" value="asc" />
                <span>Name (A-Z)</span>
            </label>
            <label className="option">
                <input type="checkbox" name="sort" value="desc" />
                <span>Due-date</span>
            </label>
            <button className="sort-button">Sort</button>
        </section>
    )
}

export default TodoSorts;