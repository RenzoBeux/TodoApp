import { PlusOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import React from "react";
import { postTodo } from "../api/todo.api";

export const FloatingButton = ({ onclick }) => {

    return (
        <button
            className="floating-button"
            onClick={onclick}
        >
                <PlusOutlined style={{borderRadius: '50%'}} />
            </button>
    )
}