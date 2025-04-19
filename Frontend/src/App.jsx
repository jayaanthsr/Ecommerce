import Login from "./component/login.jsx";
import {Route, Routes, BrowserRouter} from "react-router-dom";
import SignUp from "./component/SignUp.jsx";
import Cart from "./component/Cart.jsx";
import Home from "./component/Home.jsx";
import Admin from "./component/Admin.jsx";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Navbar from "./component/Navbar.jsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function Signup() {
    return null;
}

function Layout() {
    const location = useLocation();
    const showNavbar = location.pathname === "/";
    return (
        <>
            {showNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={localStorage.getItem("isLogged")==="admin" && <Admin/>} />
                <Route path="/cart" element={<Cart/>}></Route>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <ToastContainer/>
            <Layout />
        </Router>
    );
}

export default App;

