import { useSelector } from "react-redux";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Button, Layout, Menu } from "antd";
import {
  BulbOutlined,
  EnvironmentOutlined,
  FormOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import TreeListPage from "./admin/TreeListPage";
import TreeCreatePage from "./admin/TreeCreatePage";
import AdminAppeals from "./admin/AdminAppeals";
import PropertyreatePage from "./admin/PropertyreatePage";
import { useState } from "react";

const { Content, Sider } = Layout;

const AdminPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const [collapsed, setCollapsed] = useState(false);

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

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
          padding: "32px 0",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <Button
            // icon={<MenuOutlined />}
            // shape="circle"
            style={{ backgroundColor: "#F8C7CC", border: "none" }}
            onClick={toggleCollapsed}
          >
            {collapsed ? <MenuUnfoldOutlined  /> : <MenuFoldOutlined />}
          </Button>
        </div>
        <Menu
          mode="vertical"
          onClick={handleMenuClick}
          // selectedKeys={[location.pathname]}
          style={{ backgroundColor: "#f8f8ee", border: "none" }}
          defaultOpenKeys={['/admin/trees']}
          inlineCollapsed={collapsed}
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
        </Menu>
      </Sider>

      <Layout style={{ backgroundColor: "#f8f8ee" }}>
        <Content style={{ padding: "40px" }}>
          <Routes>
            <Route path="trees" element={<TreeListPage />} />
            <Route path="trees/create" element={<TreeCreatePage />} />
            <Route path="trees/property" element={<PropertyreatePage />} />
            <Route path="appeals" element={<AdminAppeals />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPanel;
