import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAppeals } from "../store/userAppealsSlice";
import Title from "antd/es/typography/Title";
import { Button, Card, Col, Empty, Row, Spin, Tag } from "antd";
import NewAppealForm from "./NewAppealForm";
import { Content } from "antd/es/layout/layout";

const UserAppeals = () => {
  const dispatch = useDispatch();
  const { appeals, status, error } = useSelector((state) => state.userAppeals);
  console.log("responses:", appeals);

  const loading = status === "loading";

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchUserAppeals());
  }, [dispatch]);

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const getStatusTag = (status) => {
    switch (status) {
      case "resolved":
        return <Tag color="green">Решено</Tag>;
      case "processing":
        return <Tag color="blue">В обработке</Tag>;
      case "received":
        return <Tag color="orange">Получено</Tag>;
      default:
        return <Tag>Неизвестно</Tag>;
    }
  };

  return (
    <Content style={{ padding: "40px" }}>
      <Title level={3} style={{ color: "#e8552f", fontFamily: "inherit" }}>
        Размещённые обращения
      </Title>

      <Button
        type="primary"
        onClick={toggleForm}
        style={{
          marginBottom: 20,
          background: "#e8552f",
          borderColor: "#e8552f",
        }}
      >
        {showForm ? "Скрыть форму" : "Оставить обращение"}
      </Button>

      {showForm && (
        <div style={{ marginBottom: 40 }}>
          <NewAppealForm />
        </div>
      )}

      {loading ? (
        <Spin size="large" />
      ) : appeals.length === 0 ? (
        <Empty description="У вас пока нет размещённых обращений" />
      ) : (
        <Row gutter={[24, 24]}>
          {appeals
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((appeal) => (
              <Col xs={24} sm={12} md={8} key={appeal.id}>
                <Card
                  title={`Обращение №${appeal.id}`}
                  bordered
                  style={{ borderRadius: 10 }}
                >
                  <p>
                    <strong>Дата:</strong>{" "}
                    {new Date(appeal.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Статус:</strong> {getStatusTag(appeal.status)}
                  </p>
                  <p>
                    <strong>Описание:</strong>
                    <br /> {appeal.description}
                  </p>
                  {/* блок ответа */}
                  {appeal.responses && appeal.responses.length > 0 ? (
                    appeal.responses.map((response) => (
                      <div
                        style={{
                          marginTop: "15px",
                          padding: "10px",
                          background: "#f6f6f6",
                          borderRadius: "8px",
                        }}
                      >
                        <strong>Ответ администрации:</strong>
                        <p>{appeal.response.description}</p>
                        <small>
                          От: {appeal.response.user?.name}{" "}
                          {appeal.response.user?.surname}
                        </small>
                      </div>
                    ))
                  ) : (
                    <p style={{ marginTop: "10px", color: "#999" }}>
                      Ответ администратора пока отсутствует
                    </p>
                  )}
                </Card>
              </Col>
            ))}
        </Row>
      )}
    </Content>
  );
};

export default UserAppeals;
