import React, { useState, useEffect } from "react";
import { Menu, Button, Drawer, Spin } from "antd";
import { motion } from "framer-motion";
import { MenuOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [open, setOpen] = useState(false);

  const location = useLocation();
  const isLightNavbar = ["/", "/register", "/login"].includes(
    location.pathname
  );
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { data: user, loading: userLoading } = useSelector(
  //   (state) => state.user
  // ); // Получаем данные пользователя из Redux
  const { user } = useSelector((state) => state.auth);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoggedIn = !!user;

  console.log("isAuthenticated", isLoggedIn);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Авто-закрытие Drawer при смене маршрута
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { key: "/", label: "Главная" },
    { key: "map", label: "Карта" },
    { key: "current", label: "Актуальное" },
    { key: "about", label: "О проекте" },
    // Только для НЕавторизованных
    ...(!isLoggedIn
      ? [
          // { key: "register", label: "Регистрация" },
          { key: "login", label: "Войти" },
        ]
      : []),
    // Только для авторизованных
    ...(isLoggedIn
      ? [
          {
            key: user?.role === "ADMIN" ? "admin/trees" : "profile/info",
            label: user?.role === "ADMIN" ? "Панель администратора" : "Профиль",
          },
          { key: "logout", label: "Выход" },
        ]
      : []),
  ];

  // Фильтруем пункты меню в зависимости от авторизации
  const filteredItems = menuItems.filter((item) => {
    if (
      item.key === "logout" ||
      item.key === "profile/info" ||
      item.key === "admin/trees"
    ) {
      return isLoggedIn;
    }
    if (item.key === "login" || item.key === "register") {
      return !isLoggedIn;
    }

    return true;
  });

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
        fontFamily: "Bitter",
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
                  color: isLightNavbar ? "#fff" : "#588157",
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
                    color: isLightNavbar ? "#fff" : "#588157",
                    background: "rgba(255, 255, 255, 0.2)",
                    padding: "8px 15px",
                    border: isLightNavbar ? "none" : "solid #588157",

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
            rootStyle={{ background: "#588157" }}
            styles={{
              body: {
                backgroundColor: "#f8f8ee",
                padding: 0,
              },
              header: {
                backgroundColor: "#f8f8ee",
              },
              content: {
                backgroundColor: "#f8f8ee",
              },
            }}
          >
            <Menu
              mode="vertical"
              theme="dark"
              onClick={() => setOpen(false)}
              style={{ backgroundColor: "#f8f8ee", borderRight: "none" }}
            >
              {filteredItems.map((item) =>
                item.key === "logout" ? (
                  <Menu.Item key={item.key} onClick={handleLogout}>
                    {item.label}
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    key={item.key}
                    onClick={() => {
                      setOpen(false);
                      navigate(`${item.key}`);
                    }}
                    style={{ color: "#2c5c3f" }}
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
