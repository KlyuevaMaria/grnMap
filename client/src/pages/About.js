import React from "react";
import { Typography, Row, Col, Card, Layout } from "antd";
import { motion } from "framer-motion";
import {
  EnvironmentOutlined,
  UserOutlined,
  SmileOutlined,
} from "@ant-design/icons";
// import "./CSS/about.css"; // подключите сюда свою общую стилистику

const { Title, Paragraph } = Typography;
const { Content } = Layout;

// Анимация появления блоков
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const About = () => {
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f8f8ee" }}>
      <Content
        style={{ padding: "40px 20px", maxWidth: 1200, margin: "0 auto" }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          style={{ textAlign: "center", marginBottom: 40 }}
        >
          <Title
            level={1}
            style={{
              textAlign: "center",
              margin: "30px",
              color: "#D5573B",
              fontFamily: "Poiret One",
            }}
          >
            О проекте
          </Title>
          <Paragraph
            style={{
              fontSize: 16,
              maxWidth: 800,
              margin: "0 auto",
              fontFamily: "Bitter",
            }}
          >
            Зелёная карта — это онлайн-реестр деревьев Владимира. Её создают
            неравнодушные горожане. С помощью карты можно отслеживать состояние
            зелёных насаждений, контролировать вырубку и посадку деревьев, а
            также планировать дальнейшее озеленение города.
          </Paragraph>
        </motion.div>

        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} md={12}>
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card
                style={{
                  borderRadius: 12,
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
                  padding: "20px",
                  minHeight: "100%",
                }}
              >
                <EnvironmentOutlined
                  style={{ fontSize: "32px", color: "#588157" }}
                />
                <Title level={3}>Для кого?</Title>
                <Paragraph>
                  Сайт предназначен для людей, которые заботятся об окружающей
                  среде. Для экологов, активистов, муниципальных служб,
                  студентов и всех, кто любит свой город. Он помогает жителям
                  объединяться для сохранения и заботы о зелёных зонах.
                </Paragraph>
              </Card>
            </motion.div>
          </Col>

          <Col xs={24} md={12}>
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
                  padding: "20px",
                  minHeight: "100%",
                }}
              >
                <UserOutlined style={{ fontSize: "32px", color: "#588157" }} />
                <Title level={3}>Кем создан?</Title>
                <Paragraph>
                  Это студенческий проект, разработанный двумя девушками —
                  Марией и Юлией. Мы убеждены, что даже небольшие начинания
                  могут стать отправной точкой для масштабных перемен, особенно
                  когда за ними стоят неравнодушные люди.
                </Paragraph>
              </Card>
            </motion.div>
          </Col>

          <Col xs={24}>
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.05)",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <SmileOutlined style={{ fontSize: "28px", color: "#588157" }} />
                <Paragraph style={{ marginTop: 12 }}>
                  Благодарим вас за то, что вы поддерживаете нашу инициативу и
                  заботитесь об окружающей среде 💚
                </Paragraph>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default About;
