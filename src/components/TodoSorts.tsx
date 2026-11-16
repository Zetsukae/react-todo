import './styles/TodoSorts.css';

export type TodoStatusFilter = 'all' | 'done' | 'undone';
export type TodoSortOrder = 'default' | 'name' | 'due-date';

type TodoSortsProps = {
  statusFilter: TodoStatusFilter;
  sortOrder: TodoSortOrder;
  onStatusFilterChange: (filter: TodoStatusFilter) => void;
  onSortOrderChange: (sortOrder: TodoSortOrder) => void;
};

const TodoSorts = ({
  statusFilter,
  sortOrder,
  onStatusFilterChange,
  onSortOrderChange,
}: TodoSortsProps) => {
  return (
    <section className="todo-sorts" aria-label="Todo filters and sorting">
      <div className="todo-sort-group" role="group" aria-label="Show">
        <span className="todo-sort-label">Show</span>
        {(['all', 'undone', 'done'] as const).map((filter) => (
          <label
            className={`option${statusFilter === filter ? ' active' : ''}`}
            key={filter}
          >
            <input
              type="radio"
              name="status"
              value={filter}
              checked={statusFilter === filter}
              onChange={() => onStatusFilterChange(filter)}
            />
            <span>
              {filter === 'all' ? 'All' : filter === 'done' ? 'Done' : 'Undone'}
            </span>
          </label>
        ))}
      </div>
      <div className="todo-sort-group" role="group" aria-label="Sort by">
        <span className="todo-sort-label">Sort by</span>
        {(
          [
            ['default', 'Default order'],
            ['name', 'Name (A-Z)'],
            ['due-date', 'Due date (soonest)'],
          ] as const
        ).map(([order, label]) => (
          <label
            className={`option${sortOrder === order ? ' active' : ''}`}
            key={order}
          >
            <input
              type="radio"
              name="sort-order"
              value={order}
              checked={sortOrder === order}
              onChange={() => onSortOrderChange(order)}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </section>
  );
};

export default TodoSorts;
