import logo from './logo.svg';
import { Routes, Route } from 'react-router-dom';
import Home from './home';
import Login from './login';
import Confirmation from './confirmation';
import Orders from './myorders';

function App() {



  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path='/orders' element={<Orders />} />
    </Routes>

    
  );
}

export default App;
