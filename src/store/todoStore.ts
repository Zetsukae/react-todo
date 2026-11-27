import { create } from 'zustand';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from '../api/services/todoService';
import type { Todo, TodoCreate, TodoList, TodoUpdate } from '../api/types/todo';

type TodoState = {
  todos: TodoList | null;
  isLoading: boolean;
  errorMessage: string | null;
  loadError: string | null;
};

// Synchronous state updates only: no API calls here.
type TodoStateActions = {
  mergeLoadedTodos: (loadedTodos: TodoList) => void;
  addTodoToList: (todo: Todo) => void;
  replaceTodoInList: (todo: Todo) => void;
  removeTodoFromList: (id: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setErrorMessage: (message: string | null) => void;
  setLoadError: (message: string | null) => void;
  dismissError: () => void;
};

// Async actions: call the API service, then apply the result with the state
// actions above. Mutations resolve to true on success and false on failure
// (the error banner is set by the store).
type TodoApiActions = {
  fetchTodos: (signal?: AbortSignal) => Promise<void>;
  createTodo: (todo: TodoCreate) => Promise<boolean>;
  updateTodo: (id: number, changes: TodoUpdate) => Promise<boolean>;
  deleteTodo: (id: number) => Promise<boolean>;
};

export type TodoStore = TodoState & TodoStateActions & TodoApiActions;

export const useTodoStore = create<TodoStore>()((set, get) => ({
  todos: null,
  isLoading: true,
  errorMessage: null,
  loadError: null,

  // ----- State actions -----

  // Keeps any todo created while the initial load was still in flight.
  mergeLoadedTodos: (loadedTodos) =>
    set((state) => {
      if (!state.todos) {
        return { todos: loadedTodos };
      }
      const loadedIds = new Set(loadedTodos.map((todo) => todo.id));
      return {
        todos: [
          ...loadedTodos,
          ...state.todos.filter((todo) => !loadedIds.has(todo.id)),
        ],
      };
    }),

  addTodoToList: (todo) =>
    set((state) => {
      const existingTodos = state.todos ?? [];
      return {
        todos: existingTodos.some(({ id }) => id === todo.id)
          ? existingTodos
          : [...existingTodos, todo],
      };
    }),

  replaceTodoInList: (updatedTodo) =>
    set((state) => ({
      todos:
        state.todos?.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ) ?? null,
    })),

  removeTodoFromList: (id) =>
    set((state) => ({
      todos: state.todos?.filter((todo) => todo.id !== id) ?? null,
    })),

  setIsLoading: (isLoading) => set({ isLoading }),

  setErrorMessage: (errorMessage) => set({ errorMessage }),

  setLoadError: (loadError) => set({ loadError }),

  dismissError: () => set({ errorMessage: null, loadError: null }),

  // ----- API actions -----

  fetchTodos: async (signal) => {
    const { mergeLoadedTodos, setLoadError, setIsLoading } = get();
    try {
      mergeLoadedTodos(await getTodos(signal));
    } catch (error) {
      if (!signal?.aborted) {
        console.error('Error fetching todos:', error);
        setLoadError('Unable to load tasks. Please refresh the page.');
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  },

  createTodo: async (todo) => {
    const { addTodoToList, setErrorMessage } = get();
    setErrorMessage(null);
    try {
      addTodoToList(await createTodo(todo));
      return true;
    } catch {
      setErrorMessage('Unable to create task. Please try again.');
      return false;
    }
  },

  updateTodo: async (id, changes) => {
    const { replaceTodoInList, setErrorMessage } = get();
    setErrorMessage(null);
    try {
      replaceTodoInList(await updateTodo(id, changes));
      return true;
    } catch {
      setErrorMessage('Unable to update task. Please try again.');
      return false;
    }
  },

  // The todo stays in the list so TodoItem can play its exit animation;
  // TodoItem calls removeTodoFromList once the animation has finished.
  deleteTodo: async (id) => {
    const { setErrorMessage } = get();
    setErrorMessage(null);
    try {
      await deleteTodo(id);
      return true;
    } catch {
      setErrorMessage('Unable to delete task. Please try again.');
      return false;
    }
  },
}));

// ----- Selector hooks -----

export const useTodos = () => useTodoStore((state) => state.todos);

export const useIsLoadingTodos = () => useTodoStore((state) => state.isLoading);

// An action error takes priority over the load error.
export const useErrorMessage = () =>
  useTodoStore((state) => state.errorMessage ?? state.loadError);
