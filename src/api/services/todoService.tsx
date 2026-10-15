import type { Todo, TodoCreate, TodoList } from '../types/todo';

const TODOS_URL = 'https://api.todos.in.jt-lab.ch/todos';

export const createTodo = async (todo: TodoCreate): Promise<Todo> => {
    try {
        const response = await fetch(TODOS_URL, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Prefer: 'return=representation',
            },
            body: JSON.stringify(todo),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const createdTodos = (await response.json()) as Todo[];
        const createdTodo = createdTodos[0];
        if (!createdTodo) {
            throw new Error('Todo creation returned no created todo.');
        }

        return createdTodo;
    } catch (error) {
        console.error('Error creating todo:', error);
        throw error;
    }
};

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
        if (!(error instanceof Error && error.name === 'AbortError')) {
            console.error('Error fetching todos:', error);
        }
        throw error;
    }
};
