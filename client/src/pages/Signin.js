import React, { use } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Typography,
  notification,
  Grid,
  Row,
  Col,
} from "antd";
import { motion } from "framer-motion";
import "./CSS/register.css"; // Подключаем стили
import registerImage from "./img/shot-foret.jpg"; // Фоновое изображение
import { useDispatch } from "react-redux";
import { signin } from "../store/authSlice";

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const onLogin = async (values) => {
    try {
      const result = await dispatch(signin(values));
      if (signin.fulfilled.match(result)) {
        notification.success({
          message: "Успешный вход",
          description: "Добро пожаловать!",
          placement: "topRight",
        });
        navigate("/");
      } else {
        throw new Error(result.payload?.message || "Ошибка входа");
      }
    } catch (error) {
      notification.error({
        message: "Ошибка",
        description: error.message,
        placement: "topRight",
      });
    }
  };

  return (
    <Row style={{ minHeight: "100vh" }}>
      {/* Левая часть с изображением закрывается на телефоне */}
      {!isMobile && (
        <Col span={12} style={{ position: "relative" }}>
          <div
            style={{
              backgroundImage: `url(${registerImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(58,90,64,0.42)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 40,
                width: "100%",
                padding: "0 20px",
                color: "white",
                textAlign: "center",
                fontStyle: "italic",
                fontSize: "1.2rem",
              }}
            >
              ❝ Всё-таки странно, почему принято ставить памятники всевозможным
              людям? А почему бы не поставить памятник луне или дереву в
              цвету?.. ❞
              <br />— Эрих Мария Ремарк
            </div>
          </div>
        </Col>
      )}

      {/* Правая часть - форма */}
      <Col xs={24} md={12}>
        <div
          style={{
            padding: isMobile ? 30 : 60,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            backgroundColor: "#f7f4ef",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ width: "100%", maxWidth: 400 }}
          >
            <Title
              level={1}
              style={{
                textAlign: "center",
                marginBottom: "30px",
                color: "#D5573B",
                fontFamily: "Poiret One",
              }}
            >
              Добро пожаловать в зелёную карту
            </Title>
            <Form layout="vertical" onFinish={onLogin}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Введите корректный email",
                  },
                ]}
              >
                <Input placeholder="Ваш адрес электронной почты" />
              </Form.Item>

              <Form.Item
                label="Пароль"
                name="password"
                rules={[{ required: true, message: "Введите пароль" }]}
              >
                <Input.Password placeholder="Ваш пароль" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="register-button"
                >
                  Войти
                </Button>
              </Form.Item>
            </Form>

            <Paragraph style={{ textAlign: "center", marginTop: 16 }}>
              Нет аккаунта? <a href="/register">Зарегестрироваться</a>
            </Paragraph>
          </motion.div>
        </div>
      </Col>
    </Row>
  );
};

export default Signin;
