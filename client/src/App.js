import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Router } from "react-router-dom";
import AppRoutes from "./routes/routes";
import Navbar from "./components/Navbar";
import { ConfigProvider } from "antd";
import { useState } from "react";
import { SmileOutlined } from "@ant-design/icons";
import ruRU from "antd/es/locale/ru_RU";


const customizeRenderEmpty = () => (
  <div style={{ textAlign: "center" }}>
    <SmileOutlined style={{ fontSize: 20 }} />
    <p>Ничего не найдено</p>
  </div>
);

function App() {
  const [customize, setCustomize] = useState(true);

  return (
    <BrowserRouter>
      <ConfigProvider locale={ruRU}
        renderEmpty={customize ? customizeRenderEmpty : undefined}
        theme={{
          token: {
            // Seed Token
            colorPrimary: "#588157",
            borderRadius: 5,
            fontFamily: "Bitter",
          },
          components: {
            Tabs: {
              itemHoverColor: "#3a5a40",
              itemSelectedColor: "#344e41",
            },
            Button: {
              primaryShadow: "0 2px 0 rgba(5,145,255,0.1)",
            },
          },
        }}
      >
        <Navbar />
        <AppRoutes />
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
