import React, { useState, useEffect } from "react";
import { Menu, Button, Drawer, Spin } from "antd";
import { motion } from "framer-motion";
import { MenuOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { fetchCurrentUser } from "../store/userSlice";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: user, loading: userLoading } = useSelector(
    (state) => state.user
  ); // Получаем данные пользователя из Redux
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    if (isAuthenticated && user === null) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated, user]);
  

  // useEffect(() => {
  //   dispatch(fetchCurrentUser());
  // }, [dispatch]);

  if (isAuthenticated && userLoading) {
    return (
      <div style={{ position: "absolute", top: 20, left: 20 }}>
        <Spin size="small" />
      </div>
    );
  }

  const menuItems = [
    { key: "/map", label: "Карта" },
    { key: "news", label: "Новости" },
    { key: "about", label: "О проекте" },
    { key: "register", label: "Регистрация" },
    {
      key: user?.role === "ADMIN" ? "admin" : "profile",
      label: user?.role === "ADMIN" ? "Панель администратора" : "Профиль",
    },
    { key: "login", label: "Вход" },
    { key: "logout", label: "Выход" },
  ];

  // Фильтруем пункты меню в зависимости от авторизации
  const filteredItems = menuItems.filter((item) => {
    if (item.key === "login" || item.key === "register") {
      return !isAuthenticated;
    }
    if (item.key === "logout" || item.key === "profile") {
      console.log(user);

      return isAuthenticated;
    }
    return true;
  });

  // useEffect(() => {
  //   console.log("isAuthenticated:", isAuthenticated);
  //   console.log("user:", user);
  // }, [isAuthenticated, user]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        display: "flex",
        alignItems: "center",
        gap: "15px",
        zIndex: 1000,
        fontFamily: "'Bitter', serif",
      }}
    >
      {!isMobile ? (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {filteredItems.map((item) =>
            item.key === "logout" ? (
              <Button
                key={item.key}
                type="link"
                onClick={handleLogout}
                style={{
                  color: isHomePage ? "#fff" : "#588157",
                  fontWeight: "bold",
                  fontFamily: "'Bitter', serif",
                }}
              >
                {item.label}
              </Button>
            ) : (
              <motion.div key={item.key} whileHover={{ scale: 1.1 }}>
                <Button
                  type="link"
                  onClick={() => navigate(`${item.key}`)}
                  style={{
                    textDecoration: "none",
                    color: isHomePage ? "#fff" : "#588157",
                    background: "rgba(255, 255, 255, 0.2)",
                    padding: "8px 15px",
                    border: isHomePage ? "none" : "solid #588157",

                    borderRadius: "10px",
                    fontWeight: "bold",
                    fontFamily: "'Bitter', serif",
                  }}
                >
                  {item.label}
                </Button>
              </motion.div>
            )
          )}
        </div>
      ) : (
        <>
          <Button type="text" onClick={() => setOpen(true)}>
            <MenuOutlined style={{ fontSize: "20px", color: "#588157" }} />
          </Button>
          <Drawer
            title="Меню"
            placement="right"
            onClose={() => setOpen(false)}
            open={open}
            styles={{
              body: {
                background: "#588157",
                color: "white",
              },
            }}
          >
            <Menu mode="vertical" theme="dark" onClick={() => setOpen(false)}>
              {filteredItems.map((item) =>
                item.key === "logout" ? (
                  <Menu.Item key={item.key} onClick={handleLogout}>
                    {item.label}
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    key={item.key}
                    onClick={() => {
                      navigate(`${item.key}`);
                      setOpen(false);
                    }}
                    style={{ fontFamily: "'Bitter', serif" }}
                  >
                    {item.label}
                  </Menu.Item>
                )
              )}
            </Menu>
          </Drawer>
        </>
      )}
    </motion.nav>
  );
};

export default Navbar;
