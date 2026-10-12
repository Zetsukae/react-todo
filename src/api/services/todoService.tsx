import type { TodoList } from '../types/todo';

const TODOS_URL = 'https://api.todos.in.jt-lab.ch/todos';

export const getTodos = async (signal?: AbortSignal): Promise<TodoList> => {
    try {
        const response = await fetch(TODOS_URL, {
            headers: { Accept: 'application/json' },
            signal,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return (await response.json()) as TodoList;
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
    }
};