import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, Grid } from "antd";
import {
  UserOutlined,
  EnvironmentOutlined,
  CheckSquareOutlined,

  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../store/userSlice";

import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import UserInfo from "../components/UserInfo";
import UserTrees from "../components/UserTrees";
import UserAppeals from "../components/UserAppeals";

const { Sider, Content } = Layout;
// const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const UserProfile = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [collapsed, setCollapsed] = useState(isMobile);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }) => {
    navigate(key); // Переход по маршруту
    if (isMobile) {
      setCollapsed(true);
    }
  };

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f8f8ee" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="md"
        collapsedWidth={isMobile ? 0 : 80}
        trigger={
          <div
            style={{
              textAlign: "center",
              padding: "10px 0",
              backgroundColor: "#F8C7CC",
              color: "#e8552f",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            <Button
              style={{ backgroundColor: "#F8C7CC", border: "none" }}
              onClick={toggleCollapsed}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </div>
        }
        style={{
          backgroundColor: "#f8f8ee",
          borderRight: "1px solid #ddd",
          // padding: "72px 0",
        }}
      >
        <div style={{ height: 64 }} />
        <Menu
          mode="inline"
          onClick={handleMenuClick}
          selectedKeys={[location.pathname]}
          style={{ backgroundColor: "#f8f8ee", paddingTop: 16 }}
        >
          <Menu.Item
            key="/profile/info"
            icon={<UserOutlined />}
            style={{ color: "#e8552f", fontWeight: "bold" }}
          >
            Мой профиль
          </Menu.Item>
          <Menu.Item
            key="/profile/trees"
            icon={<EnvironmentOutlined />}
            style={{ color: "#e8552f", fontWeight: "bold" }}
          >
            Мои деревья
          </Menu.Item>
          <Menu.Item
            key="/profile/appeals"
            icon={<CheckSquareOutlined />}
            style={{ color: "#e8552f", fontWeight: "bold" }}
          >
            Мои обращения
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ backgroundColor: "#f8f8ee" }}>
        <Content
          style={{
            padding: isMobile ? "20px 10px" : "40px",
            transition: "padding 0.3s",
          }}
        >
          <Routes>
            <Route path="info" element={<UserInfo />} />
            <Route path="trees" element={<UserTrees />} />
            <Route path="appeals" element={<UserAppeals />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserProfile;
