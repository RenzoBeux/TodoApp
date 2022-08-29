import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	todos: [],
	page: 0,
	size: 10,
  search: '',
	total: 0,
  doneFilter: 'all',
	newTodo: null,
};

export const todoSlice = createSlice({
	name: 'todo',
	initialState,
	reducers: {
		addTodo: (state, action) => {
			state.todos.push(action.payload);
		},
		setTodos: (state, action) => {
			state.todos = action.payload;
		},
		setPage: (state, action) => {
			state.page = action.payload;
		},
		setSize: (state, action) => {
			state.size = action.payload;
		},
		setSearch: (state, action) => {
			state.search = action.payload;
    },
    setTotal: (state, action) => {
      state.total = action.payload;
		},
		setDone: (state, action) => {
			state.doneFilter = action.payload;
		}
	},
});

// Action creators are generated for each case reducer function
export const { setTodos, addTodo, setPage, setSize, setSearch, setTotal, setDone } = todoSlice.actions;

export default todoSlice.reducer;
