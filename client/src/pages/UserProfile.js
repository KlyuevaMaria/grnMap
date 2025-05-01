import React, { useEffect, useState } from "react";
import { Layout, Menu, Form, Input, Button, Typography, Spin } from "antd";
import {
  UserOutlined,
  EnvironmentOutlined,
  CheckSquareOutlined,
  MenuOutlined,
  LoadingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../store/userSlice";

import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import UserInfo from "../components/UserInfo";
import UserTrees from "../components/UserTrees";
import UserAppeals from "../components/UserAppeals";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const UserProfile = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState();

  const handleMenuClick = ({ key }) => {
    navigate(key); // Переход по маршруту
  };

  const dispatch = useDispatch();
  const { data: user, loading } = useSelector((state) => state.user);
  // const user = useSelector((state) => state.user.data); // Получаем данные пользователя из Redux
  // const loading = useSelector((state) => state.user.loading); // Получаем состояние загрузки

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (user && form) {
      console.log(user);
      form.setFieldsValue({
        name: user.name,
        surname: user.surname,
        email: user.email,
      });
    }
  }, [user, form]);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f8f8ee" }}>
      <Sider
        width={250}
        style={{
          backgroundColor: "#f8f8ee",
          borderRight: "1px solid #ddd",
          padding: "72px 0",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Button
            // icon={<MenuOutlined />}
            style={{ backgroundColor: "#F8C7CC", border: "none" }}
            onClick={toggleCollapsed}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
        </div>
        <Menu
          mode="vertical"
          onClick={handleMenuClick}
          // defaultSelectedKeys={["/profile/info"]}
          style={{ backgroundColor: "#f8f8ee" }}
          defaultOpenKeys={["/profile/info"]}
          // selectedKeys={[location.pathname]}
          inlineCollapsed={collapsed}

          // selectedKeys={["1"]}
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
        <Content style={{ padding: "40px" }}>
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
