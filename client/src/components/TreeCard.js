import { Card, Button, Typography } from "antd";
import { Link } from "react-router-dom";

const { Paragraph } = Typography;

const TreeCard = ({ tree }) => (
  <Card
    hoverable
    style={{
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      background: "#fff",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      // fontFamily: "Bitter",
    }}
    title={<div style={{
      fontFamily: "Poiret One",
      fontSize: "20px",
      color: "#D5573B",
    }}>{tree?.type || "Неизвестное дерево"}</div>}
  >
    <div>
      <Paragraph strong>Адрес:</Paragraph>
      <Paragraph>{tree.adress || "Не указан"}</Paragraph>

      <Paragraph strong>Состояние:</Paragraph>
      <Paragraph>{tree.condition?.name || "Не указано"}</Paragraph>
    </div>

    <Button type="primary" block style={{
        marginTop: "20px",
        backgroundColor: "#F8C7CC",
        borderColor: "#F8C7CC",
        color: "#000",
        // fontWeight: "bold",
        fontFamily: "'Bitter', serif",
      }}>
      <Link to={`/tree/${tree.id}`} style={{ color: "#000" }}>
        Подробнее
      </Link>
    </Button>
  </Card>
);

export default TreeCard;
