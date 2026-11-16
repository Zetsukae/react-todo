import type { Todo, TodoCreate, TodoList, TodoUpdate } from '../types/todo';

const TODOS_URL = 'https://api.todos.in.jt-lab.ch/todos';
const REPRESENTATION_HEADERS = {
    Accept: 'application/json',
    Prefer: 'return=representation',
};
const JSON_HEADERS = {
    ...REPRESENTATION_HEADERS,
    'Content-Type': 'application/json',
};

const requestTodoRepresentation = async (
    url: string,
    options: RequestInit,
    action: string,
): Promise<Todo> => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const todos = (await response.json()) as Todo[];
        const todo = todos[0];
        if (!todo) {
            throw new Error(`Todo ${action} returned no todo.`);
        }

        return todo;
    } catch (error) {
        console.error(`Error ${action} todo:`, error);
        throw error;
    }
};

// Create a new todo item
export const createTodo = (todo: TodoCreate): Promise<Todo> =>
    requestTodoRepresentation(
        TODOS_URL,
        {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify(todo),
        },
        'creation',
    );

// Update a todo item's fields
export const updateTodo = (id: number, changes: TodoUpdate): Promise<Todo> =>
    requestTodoRepresentation(
        `${TODOS_URL}?id=eq.${id}`,
        {
            method: 'PATCH',
            headers: JSON_HEADERS,
            body: JSON.stringify(changes),
        },
        'update',
    );

// Delete a todo item and return the deleted todo
export const deleteTodo = (id: number): Promise<Todo> =>
    requestTodoRepresentation(
        `${TODOS_URL}?id=eq.${id}`,
        {
            method: 'DELETE',
            headers: REPRESENTATION_HEADERS,
        },
        'deletion',
    );

// Fetch the list of todos
export const getTodos = async (signal?: AbortSignal): Promise<TodoList> => {
    try {
        const response = await fetch(TODOS_URL, {
            headers: { Accept: REPRESENTATION_HEADERS.Accept },
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
