import React, { useEffect } from "react";
import { Layout, Form, Input, Button, Typography, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "../store/userSlice";

const { Content } = Layout;
const { Title } = Typography;

const UserInfo = () => {
  const [form] = Form.useForm();

  const handleFormSubmit = (values) => {
    console.log("Updated user data:", values);
    // тут будет API-запрос
  };

  const dispatch = useDispatch();
  const { data: user, loading } = useSelector((state) => state.user);


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

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f8f8ee" }}>
      <Layout style={{ backgroundColor: "#f8f8ee" }}>
        <Content style={{ padding: "40px" }}>
        <Title level={3} style={{ color: "#e8552f", fontFamily: "Poiret One" }}>
        Профиль
          </Title>
          {loading ? (
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          ) : (
            <Form
              layout="vertical"
              form={form}
              onFinish={handleFormSubmit}
              style={{ maxWidth: 600 }}
            >
              <div style={{ display: "flex", gap: 32 }}>
                <Form.Item
                  label="Имя"
                  name="name"
                  style={{ flex: 1 }}
                  rules={[{ required: true, message: "Введите имя" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Фамилия"
                  name="surname"
                  style={{ flex: 1 }}
                  rules={[{ required: true, message: "Введите фамилию" }]}
                >
                  <Input />
                </Form.Item>
              </div>
              <Form.Item
                label="Электронная почта"
                name="email"
                rules={[
                  { required: true, message: "Введите email" },
                  { type: "email", message: "Некорректный email" },
                ]}
              >
                <Input disabled />
              </Form.Item>

              {/* <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: "#e8552f",
                    borderColor: "#e8552f",
                    padding: "0 32px",
                    height: "40px",
                    borderRadius: "8px",
                  }}
                >
                  Изменить
                </Button>
              </Form.Item> */}
            </Form>
          )}{" "}
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserInfo;
