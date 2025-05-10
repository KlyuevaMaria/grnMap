import { Navigate, Route, Routes } from "react-router-dom";
import Main from "../pages/Main";
import Map from "../pages/Map";
import About from "../pages/About";
import AdminPanel from "../pages/AdminPanel";
import Reg from "../pages/reg";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import UserProfile from "../pages/UserProfile";
import TreeDetailPage from "../pages/admin/TreeDetailPage";
import TreeEditPage from "../pages/admin/TreeEditPage";
import AdminAppeals from "../pages/admin/AdminAppeals";
import EmailVerificationPage from "../pages/EmailVerificationPage";
import Current from "../pages/Current";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />}></Route>
      <Route path="/map" element={<Map />}></Route>
      <Route path="/current" element={<Current />}></Route>
      <Route path="/about" element={<About />}></Route>
      <Route path="/register" element={<Signup />}></Route>
      <Route path="/login" element={<Signin />}></Route>
      <Route path="/verify-email" element={<EmailVerificationPage />}></Route>
      <Route path="/profile/*" element={<UserProfile />} />
      {/* Админка */}
      <Route path="/admin/*" element={<AdminPanel />}></Route>
      <Route path="/tree/:id" element={<TreeDetailPage />} />
      <Route path="/tree/:id/edit" element={<TreeEditPage />} />
      <Route path="/admin/appeal" element={<AdminAppeals />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
