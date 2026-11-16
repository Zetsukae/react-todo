export type TodoCreate = { title: string } &
    Partial<{ content: string | null; due_date: string | null }>;

export type Todo = TodoCreate & {
    id: number;
    content: string | null;
    due_date: string | null;
    done: boolean;
};

export type TodoUpdate = Partial<Pick<Todo, 'title' | 'content' | 'due_date' | 'done'>>;

export type TodoList = Todo[];