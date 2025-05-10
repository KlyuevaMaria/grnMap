import React from "react";
import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Title, Paragraph } = Typography;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f8ee",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: 600,
          background: "#fff",
          padding: "40px 30px",
          borderRadius: 10,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: 10 }}>🌿</div>

        <Title level={1} style={{ color: "#D5573B", fontFamily: "Poiret One" }}>
          404 — Страница не найдена
        </Title>

        <Paragraph style={{ fontSize: "16px", fontFamily: "Bitter" }}>
          Увы, но такой страницы не существует. Проверьте адрес или вернитесь на главную.
        </Paragraph>

        <Button
          type="primary"
          onClick={() => navigate("/")}
          style={{
            marginTop: 20,
            backgroundColor: "#D5573B",
            borderColor: "#D5573B",
            fontFamily: "Poiret One",
            height: "45px",
            padding: "0 30px",
            fontWeight: "bold",
          }}
        >
          На главную
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
