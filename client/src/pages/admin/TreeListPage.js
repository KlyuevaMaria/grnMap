import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrees } from "../../store/trees/treeThunks";
import TreeCard from "../../components/TreeCard";
import { Col, Row, Spin } from "antd";
import Title from "antd/es/skeleton/Title";

const TreeListPage = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.trees);

  useEffect(() => {
    dispatch(fetchTrees());
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", background: "#f9f9f9", minHeight: "100vh" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
        Список деревьев
      </Title>
      <Row gutter={[24, 24]}>
        {list.map((tree) => (
          <Col key={tree.id} xs={24} sm={12} md={8} lg={6}>
            <TreeCard tree={tree} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TreeListPage;