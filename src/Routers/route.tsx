import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import Auth from "./Auth/Auth";
import InnerProfile from "../Pages/Profile/InnerProfile";

const Routers = () => {
  return (
    <>
      <Routes>
        <Route element={<Auth />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<InnerProfile />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default Routers;
