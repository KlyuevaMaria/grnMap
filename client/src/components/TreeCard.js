import { Card, Button, Typography } from "antd";
import { Link } from "react-router-dom";

const { Paragraph } = Typography;

const TreeCard = ({ tree }) => (
  <Card
    hoverable
    style={{
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
    title={<div style={{ fontWeight: "bold" }}>{tree?.type || "Неизвестное дерево"}</div>}
  >
    <div>
      <Paragraph strong>Адрес:</Paragraph>
      <Paragraph>{tree.adress || "Не указан"}</Paragraph>

      <Paragraph strong>Состояние:</Paragraph>
      <Paragraph>{tree.condition?.name || "Не указано"}</Paragraph>
    </div>

    <Button type="primary" block style={{ marginTop: "20px" }}>
      <Link to={`/tree/${tree.id}`} style={{ color: "#ffd4ff" }}>
        Подробнее
      </Link>
    </Button>
  </Card>
);

export default TreeCard;
