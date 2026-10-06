import './styles/TodoSorts.css';

const TodoSorts = () => {
    return (
        <section className="todo-sorts">
            <p>Filter &amp; Sorting:</p>
            <label className="option">
                <input type="radio" name="status" value="all" defaultChecked />
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
            <label className="option sort-option">
                <input type="checkbox" name="sort" value="asc" />
                <span>Name (A-Z)</span>
            </label>
            <label className="option">
                <input type="checkbox" name="sort" value="desc" />
                <span>Due-date</span>
            </label>
        </section>
    )
}

export default TodoSorts;