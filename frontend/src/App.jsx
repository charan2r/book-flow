import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import AppointmentList from "./components/AppointmentList";
import Register from "./components/Register";
import Login from "./components/Login";
import Auth from "./components/Auth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Auth />}>
              <Route path="/home" element={<Home />} />
              <Route path="/appointments" element={<AppointmentList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
