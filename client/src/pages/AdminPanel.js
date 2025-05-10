import { useSelector } from "react-redux";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Button, Layout, Menu, Grid } from "antd";
import {
  BulbOutlined,
  EnvironmentOutlined,
  FormOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";

import TreeListPage from "./admin/TreeListPage";
import TreeCreatePage from "./admin/TreeCreatePage";
import AdminAppeals from "./admin/AdminAppeals";
import PropertyreatePage from "./admin/PropertyreatePage";
import { useEffect, useState } from "react";
import UserProfile from "./UserProfile";

const { Content, Sider } = Layout;
const { useBreakpoint } = Grid;

const AdminPanel = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [collapsed, setCollapsed] = useState(isMobile);

  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

 useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  const handleMenuClick = ({ key }) => {
    navigate(key); // Переход по маршруту
    if (isMobile) {
      setCollapsed(true);
    }
  };

 

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
            key="/admin/trees"
            icon={<EnvironmentOutlined />}
            style={{ color: "#e8552f", fontWeight: "bold" }}
          >
            Все деревья
          </Menu.Item>
          <Menu.Item
            key="/admin/trees/create"
            icon={<FormOutlined />}
            style={{ color: "#e8552f", fontWeight: "bold" }}
          >
            Добавить дерево
          </Menu.Item>
          <Menu.Item
            key="/admin/trees/property"
            icon={<UnorderedListOutlined />}
            style={{ color: "#e8552f", fontWeight: "bold" }}
          >
            Характеристики
          </Menu.Item>
          <Menu.Item
            key="/admin/appeals"
            icon={<BulbOutlined />}
            style={{ color: "#e8552f", fontWeight: "bold" }}
          >
            Обращения пользователей
          </Menu.Item>
          <Menu.Item
            key="/profile/info"
            icon={<UserOutlined />}
            style={{ color: "#e8552f", fontWeight: "bold" }}
          >
            Профиль администратора
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
            <Route path="trees" element={<TreeListPage />} />
            <Route path="trees/create" element={<TreeCreatePage />} />
            <Route path="trees/property" element={<PropertyreatePage />} />
            <Route path="appeals" element={<AdminAppeals />} />
            <Route path="profile/info" element={<UserProfile />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPanel;
