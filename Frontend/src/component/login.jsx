import { useState } from "react";
import "./styles/login.css"
import axios from "axios";
import {useNavigate} from "react-router-dom";

function Login() {

    let loginContainer = "login-container";
    let feild="feild";
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    var login=()=> {

        axios.post("http://localhost:8080/login", {username: username, password: password})
            .then(res => {
                localStorage.setItem("isLogged", "false");
                if (username === "admin" && res.data) {
                    window.alert("Admin Login completed successfully");
                    localStorage.setItem("isLogged", "admin");
                    navigate("/admin")
                } else if (res.data) {
                    window.alert("Login successfully");
                    localStorage.setItem("userName",username);
                    localStorage.setItem("isLogged","user")
                    navigate("/")
                } else {
                    window.alert("incorrect username or password");
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <>
            <div className={loginContainer}>
                <h2>Login Page</h2>
                <div className={feild}>
                    <label htmlFor="username">USERNAME:</label>
                    <input
                        type="text"
                        required
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>

                <div className={feild}>
                    <label htmlFor="password">PASSWORD:</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div>
                        <input
                            type="checkbox"
                            id="showPassword"
                            checked={showPassword}
                            onChange={() => setShowPassword(!showPassword)}
                        />
                        <label htmlFor="showPassword">Show Password</label>
                    </div>
                </div>
                <button
                    className="login-button"
                    onClick={login}
                >Login</button>
                <br/>
                <br/>
                <a href="/signup">signup first,if you are a new user</a>
            </div>
        </>
    );
}

export default Login;
