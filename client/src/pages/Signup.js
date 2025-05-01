import React, { use, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, notification } from "antd";
import { motion } from "framer-motion";
import "./CSS/register.css"; // Подключаем стили
import registerImage from "./img/shot-foret.jpg"; // Фоновое изображение
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../store/authSlice"; 

const { Title, Paragraph } = Typography;

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error, successMessage } = useSelector((state) => state.auth);
  useEffect(() => {
    if (status === "succeeded" && successMessage) {
      notification.success({
        message: "Успешная регистрация",
        description: successMessage,
        placement: "topRight",
      });

      setTimeout(() => {
        navigate("/login"); // редиректим после уведомления
      }, 3000);
    }
  }, [status, successMessage, navigate]);

  useEffect(() => {
    if (status === "failed" && error) {
      notification.error({
        message: "Ошибка регистрации",
        description: error,
        placement: "topRight",
      });
    }
  }, [status, error]);

  const onFinish = async (values) => {
    const userData = {
      name: values.firstName,
      surname: values.lastName,
      email: values.email,
      password: values.password,
      role: "USER",
    };

    try {
      const resultAction = await dispatch(signup(userData));

      if (signup.fulfilled.match(resultAction)) {
        notification.success({
          message: "Успешная регистрация",
          description: "Письмо с подтверждением отправлено на ваш email.",
          placement: "topRight",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        notification.error({
          message: "Ошибка регистрации",
          description:
            resultAction.payload?.message ||
            "Что-то пошло не так. Попробуйте ещё раз.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Ошибка регистрации",
        description: error.message || "Ошибка при отправке данных",
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
          ❝ Вырастает дума, словно дерево, вроет в сердце корни глубокие, по
          поднебесью ветвями раскинется, задрожит, зашумит тучей листьев ❞
          <br />— Алексей Толстой
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
            Регистрация
          </Title>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Имя"
              name="firstName"
              rules={[{ required: true, message: "Введите имя" }]}
            >
              <Input placeholder="Введите имя" />
            </Form.Item>

            <Form.Item
              label="Фамилия"
              name="lastName"
              rules={[{ required: true, message: "Введите фамилию" }]}
            >
              <Input placeholder="Введите фамилию" />
            </Form.Item>

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
              <Input placeholder="Введите email" />
            </Form.Item>

            <Form.Item
              label="Пароль"
              name="password"
              rules={[{ required: true, message: "Введите пароль" }]}
            >
              <Input.Password placeholder="Введите пароль" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="register-button"
              >
                Зарегистрироваться
              </Button>
            </Form.Item>
          </Form>

          {/* Ссылка на вход */}
          <Paragraph className="login-link">
            Уже есть аккаунт? <a href="/login">Войти</a>
          </Paragraph>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
