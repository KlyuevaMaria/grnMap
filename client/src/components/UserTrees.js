import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Spin, Empty, Button } from "antd";
import { EnvironmentOutlined, SmileOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserTrees } from "../store/userTreesSlice";
import { Content } from "antd/es/layout/layout";

const { Title } = Typography;

const UserTrees = () => {
  //   const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const { trees, status, error } = useSelector((state) => state.userTrees);

  useEffect(() => {
    dispatch(fetchUserTrees());

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [dispatch]);

  //   useEffect(() => {
  //     // Здесь можно заменить на fetch('/api/user/trees')...
  //     setTimeout(() => {
  //       setTrees(mockTrees);
  //       setLoading(false);
  //     }, 1000);
  //   }, []);

  return (
    <Content style={{ padding: "40px" }}>
      <Title level={3} style={{ color: "#e8552f", fontFamily: "Poiret One" }}>
        Добавленные деревья
      </Title>

      {loading ? (
        <Spin size="large" />
      ) : trees.length === 0 ? (
        <Empty description="У вас пока нет добавленных деревьев" />
      ) : (
        <Row gutter={[24, 24]}>
          {trees.map((tree) => (
            <Col xs={24} sm={12} md={8} lg={6} key={tree.id}>
              <Card
                title={tree.species}
                bordered={false}
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                }}
                cover={
                  tree.photos && tree.photos.length > 0 ? (
                    <img
                      alt={tree.type}
                      src={`http://localhost:8080/static/photo/${tree.photos[0].name}`}
                    />
                  ) : (
                    <Empty
                      description="Нет фото"
                      image={<SmileOutlined />}
                      style={{ fontSize: 28, color: "#aaa" }}
                    />
                  )
                }
              >
                <p>
                  <EnvironmentOutlined /> <strong>Местоположение:</strong>{" "}
                  {tree.adress}
                </p>
                <p>
                  <strong>Год посадки:</strong>{" "}
                  {/* {new Date(tree.year_of_planting).toLocaleDateString()} */}
                  {tree.year_of_planting}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Content>
  );
};

export default UserTrees;
