import { getTodos } from "./todo.api"
import { useSelector, useDispatch } from 'react-redux'
import { setDone, setPage, setSearch, setTodos, setTotal } from "../store/reducers/todo.reducer";

export const refreshTodos = (dispatcher, token, page, search, done) => {
    getTodos(token,page,search, done).then(data => {
        dispatcher(setTodos(data.content));
        dispatcher(setPage(page));
        dispatcher(setSearch(search));
        dispatcher(setDone(done));
        dispatcher(setTotal(data.totalElements));
    }).catch(err => {
        console.log(err);
    });

}