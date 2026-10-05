import type { TodoList } from '../types/todo';

const TODOS_URL = 'https://api.todos.in.jt-lab.ch/todos';

export const getTodos = async (): Promise<TodoList> => {
    const response = await fetch(TODOS_URL, {
        headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch todos: ${response.status}`);
    }

    return response.json() as Promise<TodoList>;
};
