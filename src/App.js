import LoginForm from './components/LoginForm/LoginForm';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';
import About from './components/About/About';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';

function App() {
    return (
        <div >
            <Router>
                <Routes>
                    <Route path="/Signup" element = {<Signup/>} ></Route>
                    <Route path="/LoginForm" element={<LoginForm/>}></Route>
                    <Route path="/Home" element={<Home/>}></Route>
                    <Route path="/About" element={<About/>}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
