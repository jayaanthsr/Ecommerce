import Login from "./component/login.jsx";
import {Route,Routes,BrowserRouter} from "react-router-dom";
import SignUp from "./component/SignUp.jsx";
import Home from "./component/Home.jsx";

function App() {


  return (
    <>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Login/>} />
              <Route path="/signup" element={<SignUp/>} />
              <Route path="/home" element={<Home/>}></Route>
          </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
