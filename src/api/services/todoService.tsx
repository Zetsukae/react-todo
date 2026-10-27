import type { Todo, TodoCreate, TodoList } from '../types/todo';

const TODOS_URL = 'https://api.todos.in.jt-lab.ch/todos';

// Create a new todo item
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

// Delete a todo item
export const deleteTodo = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${TODOS_URL}?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
};

// Fetch the list of todos
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
