import React from "react";
import { login } from "../api/auth.api";
import { setUser } from "../store/reducers/user.reducer";
import { useSelector, useDispatch } from 'react-redux'
import { Button, message, Row } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";


export const Login = () => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const dispatch = useDispatch();
    message.config({
        duration: 5,
    });

    const loginFunc =  async () => {
        try {
            message.loading({ content: 'Login in...', key: 'loading' });
            const log = await login(username, password)
            message.success({ content: 'Loged in succesfully', key: 'loading', duration: 2 });
            dispatch(setUser(log));
        } catch (error) {
            console.log(error);
            if (error.response.status === 401) {
                message.error({ content: 'Invalid username or password', key: 'loading', duration: 2 });
            } else {
                message.error({ content: error.message, key: 'loading' });
            }
        }
    }

    return (
        <div className="login-container">
            <Row>
                <h1>Login</h1>
            </Row>
            <Row>
                <input className="login-input" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </Row>
            <Row>
                <input className="login-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                            loginFunc()
                        }
                    }
                    } />
            </Row>
            <Row>
                <Button onClick={async (e) => {
                    e.preventDefault();
                    loginFunc()
                }
                   }
                    ><ArrowRightOutlined /></Button>
            </Row>
            {/* Register */}
            <Row>
                <p> Don't have an account? <a href="/register">Register</a></p>
            </Row>


        </div>
    );
    }