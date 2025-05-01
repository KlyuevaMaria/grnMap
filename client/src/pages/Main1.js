import React from "react";
import futuristiCity from "./img/futuristic-city.jpg";
import benchPark from "./img/bench-park.jpg";
import reg from "./img/reg.svg";
import add from "./img/add.svg";
import "./CSS/main1.css";
import { motion } from "framer-motion";
import { Button, Card, Typography, Row, Col, Image, notification } from "antd";

const { Title, Paragraph } = Typography;

// Анимация появления
const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

// Анимация для карточек
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const GreenMap = () => {
  return (
    <div>
      {/* Хедер */}
      <div className="main-container">
        <div className="overlay"></div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
          className="content"
        >
          <Title level={1} className="main-title">
            Зелёная карта
          </Title>
          <motion.div whileHover={{ scale: 1.1 }}>
            <Button type="primary" size="large" className="main-button">
              Открыть
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* О проекте */}
      <div className="about-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeIn}
          viewport={{ once: true }}
          style={{
            height: "100vh",
            backgroundColor: "#F7F4EF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 40px",
          }}
        >
          <Row gutter={[32, 32]} align="middle">
            <Col xs={32} md={12}>
              <motion.img
                src={futuristiCity}
                alt="Green City"
                style={{ width: "60%", borderRadius: "10px" }}
                variants={cardVariants}
              />
            </Col>
            <Col xs={24} md={12}>
              <Title
                level={1}
                style={{
                  fontFamily: "'Poiret One', cursive",
                  color: "#ff4d4f",
                }}
              >
                Зачем карта?
              </Title>
              <Paragraph
                style={{
                  fontSize: "16px",
                  color: "#555",
                  fontFamily: "Bitter",
                }}
              >
                Во Владимире пока не существует утверждённой методики расчёта
                экономических эффектов от вложений в зелёные зоны. Мы убеждены,
                что она должна появиться. Один из первых шагов — создание
                Зелёной карты, электронного реестра деревьев.
              </Paragraph>
            </Col>
          </Row>
        </motion.div>
      </div>

      {/* Инициативный проект */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={fadeIn}
        viewport={{ once: true }}
        style={{
          position: "relative",
          height: "100vh",
          backgroundImage: `url(${benchPark})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Затемняющий слой */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(58,90,64,0.7)",
          }}
        ></div>

        {/* Прямоугольник с текстом */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "10px",
            maxWidth: "800px",
            textAlign: "center",
            zIndex: 2,
          }}
        >
          <Title level={2} style={{ color: "#ff4d4f" }}>
            Инициативный проект
          </Title>
          <Paragraph style={{ fontSize: "16px", color: "#555" }}>
            Полные и достоверные данные о деревьях помогут оценить ситуацию и
            лягут в основу стратегии развития зелёных насаждений города. Это
            инструмент для муниципальных служб, экологов и жителей.
          </Paragraph>
        </motion.div>
      </motion.div>

      {/* Как участвовать */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={fadeIn}
        viewport={{ once: true }}
        className="participation-section"
      >
        <Title level={2} className="title-part">
          Как стать частью проекта?
        </Title>
        <Row gutter={[32, 32]} justify="center" className="cards-container">
          <Col xs={24} md={10}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <a href="/register">
                <Card
                  hoverable
                  cover={<img alt="Регистрируйся!" src={reg} />}
                  className="custom-card"
                >
                  <Title level={3} className="card-title">
                    Зарегистрируйся
                  </Title>
                  <Paragraph className="card-text">
                    Чтобы мы знали героев в лицо!
                  </Paragraph>
                </Card>
              </a>
            </motion.div>
          </Col>
          <Col xs={24} md={10}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <a href="/map">
                <Card
                  hoverable
                  cover={<img alt="Добавляй деревья" src={add} />}
                  className="custom-card"
                >
                  <Title level={3} className="card-title">
                    Гуляй и добавляй
                  </Title>
                  <Paragraph className="card-text">
                    Добавляй деревья в реестр!
                  </Paragraph>
                </Card>
              </a>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </div>
  );
};

export default GreenMap;
