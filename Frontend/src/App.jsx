import Login from "./component/login.jsx";
import {Route,Routes,BrowserRouter} from "react-router-dom";
import SignUp from "./component/SignUp.jsx";
import Home from "./component/Home.jsx";
import Admin from "./component/Admin.jsx";

function App() {


  return (
    <>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Login/>} />
              <Route path="/signup" element={<SignUp/>} />
              <Route path="/home" element={<Home/>}></Route>
              <Route path="/admin" element={<Admin/>} />
          </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
