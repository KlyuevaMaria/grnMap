import React, { useEffect, useState } from "react";
import { Result, Button, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";

const EmailVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      if (!token) {
        setSuccess(false);
        setLoading(false);
        return;
      }

      try {
        await axios.get(`http://localhost:8080/api/user/verify?token=${token}`);
        setSuccess(true);
      } catch (error) {
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [location.search]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.6 } }}
      style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: 20 }}
    >
      <div style={{ textAlign: "center" }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ marginBottom: "20px" }}
        >
          {success ? (
            <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: "80px" }} />
          ) : (
            <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: "80px" }} />
          )}
        </motion.div>

        {success ? (
          <Result
            status="success"
            title="Email успешно подтверждён!"
            subTitle="Теперь вы можете войти в свой аккаунт."
            extra={[
              <Button type="primary" key="login" onClick={() => navigate("/login")}>
                Перейти к входу
              </Button>,
            ]}
          />
        ) : (
          <Result
            status="error"
            title="Ошибка подтверждения"
            subTitle="Токен недействителен или срок его действия истёк."
            extra={[
              <Button type="primary" key="home" onClick={() => navigate("/")}>
                На главную
              </Button>,
            ]}
          />
        )}
      </div>
    </motion.div>
  );
};

export default EmailVerificationPage;
