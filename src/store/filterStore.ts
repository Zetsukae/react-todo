import { create } from 'zustand';

export type TodoStatusFilter = 'all' | 'done' | 'undone';
export type TodoSortOrder = 'default' | 'name' | 'due-date';

type FilterStore = {
  statusFilter: TodoStatusFilter;
  sortOrder: TodoSortOrder;
  setStatusFilter: (statusFilter: TodoStatusFilter) => void;
  setSortOrder: (sortOrder: TodoSortOrder) => void;
};

export const useFilterStore = create<FilterStore>()((set) => ({
  statusFilter: 'all',
  sortOrder: 'default',
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
}));

export const useStatusFilter = () =>
  useFilterStore((state) => state.statusFilter);

export const useSortOrder = () => useFilterStore((state) => state.sortOrder);
