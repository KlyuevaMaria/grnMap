import React, { use } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, notification } from "antd";
import { motion } from "framer-motion";
import "./CSS/register.css"; // Подключаем стили
import registerImage from "./img/shot-foret.jpg"; // Фоновое изображение
import { useDispatch } from "react-redux";
import { signin } from "../store/authSlice";

const { Title, Paragraph } = Typography;

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();



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
    <div className="register-container">
      {/* Левая часть с изображением */}
      <div className="register-image">
        {/* Затемняющий слой */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(58,90,64,0.42)",
          }}
        ></div>

        <div className="quote">
          ❝ Всё-таки странно, почему принято ставить памятники всевозможным
          людям? А почему бы не поставить памятник луне или дереву в цвету?.. ❞
          <br />— Эрих Мария Ремарк
        </div>
      </div>

      {/* Правая часть - форма */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="right-container"
      >
        <div className="register-form">
          <Title level={2} className="form-title">
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
        </div>
      </motion.div>
    </div>
  );
};

export default Signin;
