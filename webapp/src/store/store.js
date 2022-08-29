import { configureStore } from '@reduxjs/toolkit'
import todoReducer from './reducers/todo.reducer'
import userReducer from './reducers/user.reducer'

export const store = configureStore({
    reducer: {
        todo: todoReducer,
        user: userReducer,
  },
})