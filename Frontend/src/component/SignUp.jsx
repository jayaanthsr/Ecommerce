import { useState } from "react";
import "./styles/login.css"
import axios from "axios";
import {useNavigate} from "react-router-dom";

function SignUp() {
    let loginContainer = "login-container";
    let feild="feild";
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    var login=()=>{
        axios.post("http://localhost:8080/signup",{username:username,password:password})
            .then(res=>{console.log(res)
                if(res.data){
                    navigate("/login")
                }
                else{
                    window.alert("username already exist")
                }
            })
            .catch(err=>{console.log(err)})
    }

    return (
        <>
            <div className={loginContainer}>
                <h2>Sign Up Page</h2>
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

                <button className="login-button" onClick={login}>Sign Up</button>
                <br/>
                <br/>
                <a href="/login">if already have a account</a>
            </div>
        </>
    );
}

export default SignUp;
