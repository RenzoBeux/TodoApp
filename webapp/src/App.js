import React from "react";
import { useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";


export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"  exact element={<AuthRoute/>} />
                <Route path="/register" exact element={<Register/>} />
             </Routes>
        </BrowserRouter>
    );
}

const AuthRoute = ({ component: Component, ...rest }) => {
    const user = useSelector(state => state.user.user);
    return (
        user ? <Dashboard/> : <Login/>
    );
}