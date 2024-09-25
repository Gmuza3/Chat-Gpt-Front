import { useLocation, useNavigate } from "react-router-dom";
import Routers from "../Routers/route";
import style from "./style.module.css";
import Profile from "../Pages/Profile/profile";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stylePath = location.pathname === '/register' || location.pathname.endsWith('/Login') ||  location.pathname.endsWith('/login') || location.pathname.endsWith('/profile');
  const profileStylePath = location.pathname === '/register' || location.pathname.endsWith('/Login') ||  location.pathname.endsWith('/login');
  return (
    <div className={stylePath? " w-full h-screen bg-[#1A232E] relative py-5 overflow-auto" : " w-full h-screen bg-[#1A232E] relative flex flex-col justify-between py-5 overflow-auto"}>
      <div className={style["gradient-01"]}></div>
      <div className={style["gradient-02"]}></div>
      <header className="font-semibold uppercase text-gray-300 text-center relative z-50">
        <h3 className="font-custom tracking-normal text-2xl mb-5 cursor-pointer" onClick={() => navigate('/')}>
          chatgpt4.0
        </h3>
        {!profileStylePath &&  <Profile/>}
      </header>
      <Routers/>
    </div>
  );
};

export default Layout;
