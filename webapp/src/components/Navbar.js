import React from "react";
import { Menu } from "antd";
import { setUser } from "../store/reducers/user.reducer";
import { useDispatch } from "react-redux";
import { logout } from "../api/auth.api";

export const Navbar = () => {
    const dispatch = useDispatch();
    const items = [
        { label: 'TODOS', key: 'todos' }, // remember to pass the key prop
        {
            label: 'Logout', key: 'logout', className: 'logout', onClick: async () => {
            await logout();
            dispatch(setUser(null))
            }
        },
      ];
    return (
        <Menu className="navbar" mode='horizontal' items={items}/>
    )
}