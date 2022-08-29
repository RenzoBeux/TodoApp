import React, { useEffect } from "react";
import { login, register } from "../api/auth.api";
import { setUser } from "../store/reducers/user.reducer";
import { useSelector, useDispatch } from 'react-redux'
import { Button, Input, message, Row } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';


export const Register = () => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passConfirm, setPassConfirm] = React.useState("");
    const [email, setEmail] = React.useState("");

    const [passMismatch,setPassMismatch] = React.useState(false);

    const navigate = useNavigate();

    message.config({
        duration: 5,
    });

    useEffect(() => {
        if (passConfirm !== password) {
            setPassMismatch(true);
        } else {
            setPassMismatch(false);
        }
    } , [passConfirm, password]);

    return (
        <div className="login-container">
            <Row>
                <h1>Register</h1>
            </Row>
            <Row>
                <input className="login-input" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </Row>
            <Row>
                <input className={`login-input ` + (passMismatch ? 'mismatch-pass' : '')}  type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Row>
            <Row>
                <input  className={'login-input ' + (passMismatch ? 'mismatch-pass' : '')} type="password" placeholder="Confirm password" value={passConfirm} onChange={(e) => setPassConfirm(e.target.value)} />
            </Row>
            <Row>
                <Input className="login-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Row>
            <Row>
                <Button onClick={
                    async (e) => {
                        try {
                            e.preventDefault();
                            message.loading({ content: 'Registering...', key: 'loading-register' });
                            const log = await register(username, password,email)
                            message.success({ content: 'Registered succesfully', key: 'loading-register', duration: 5 });
                            // goes to login page
                            navigate('/');
                            
                        } catch (error) {
                            console.log(error);
                                message.error({ content: error.message, key: 'loading-register' });
                        }
                    }}
                    type="submit"><ArrowRightOutlined /></Button>
            </Row>
            {/* Register */}
            <Row>
            <p>Already have an account? <a href="/">Log in!</a></p>
            </Row>


        </div>
    );
    }