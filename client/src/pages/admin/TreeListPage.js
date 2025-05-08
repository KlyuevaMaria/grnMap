import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrees } from "../../store/trees/treeThunks";
import TreeCard from "../../components/TreeCard";
import { Col, Row, Spin, Typography, Select, Pagination } from "antd";

const { Title } = Typography;
const { Option } = Select;

const TreeListPage = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.trees);

  const [filteredList, setFilteredList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [conditionFilter, setConditionFilter] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortStrategy, setSortStrategy] = useState("newest");

  useEffect(() => {
    dispatch(fetchTrees());
  }, [dispatch]);

  useEffect(() => {
    if (!list) return;

    let result = [...list];

    // Фильтрация
    if (conditionFilter) {
      result = result.filter(
        (tree) => tree.condition?.name === conditionFilter
      );
    }

    // Сортировка
    result.sort((a, b) => {
      const isCutA = a.condition?.name?.toLowerCase() === "вырублено";
      const isCutB = b.condition?.name?.toLowerCase() === "вырублено";

      // Вырубленные внизу
      if (isCutA && !isCutB) return 1;
      if (!isCutA && isCutB) return -1;

      // Далее сортировка по выбранному методу
      if (sortStrategy === "asc") {
        const nameA = a.type?.toLowerCase() || "";
        const nameB = b.type?.toLowerCase() || "";
        return nameA.localeCompare(nameB);
      }

      if (sortStrategy === "desc") {
        const nameA = a.type?.toLowerCase() || "";
        const nameB = b.type?.toLowerCase() || "";
        return nameB.localeCompare(nameA);
      }

      // По умолчанию: новые сверху
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateA - dateB;
    });

    setFilteredList(result);
    setCurrentPage(1); // сброс страницы при фильтрации
  }, [list, conditionFilter, sortStrategy]);

  const currentData = filteredList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const uniqueConditions = [
    ...new Set(list.map((tree) => tree.condition?.name).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px 20px",
        // background: "#F7F4EF",
        minHeight: "100vh",
        fontFamily: "'Bitter', serif",
      }}
    >
      <Title
        level={1}
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#D5573B",
          fontFamily: "Poiret One",
        }}
      >
        Список деревьев
      </Title>

      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Select
          placeholder="Фильтр по состоянию"
          allowClear
          style={{ width: 200 }}
          onChange={(value) => setConditionFilter(value)}
        >
          {uniqueConditions.map((cond) => (
            <Option key={cond} value={cond}>
              {cond}
            </Option>
          ))}
        </Select>

        <Select
          value={sortStrategy}
          style={{ width: 200 }}
          onChange={(val) => setSortStrategy(val)}
        >
          <Option value="newest"> Сначала Новые </Option>
          <Option value="asc"> А-Я </Option>
          <Option value="desc">Я-А</Option>
        </Select>
      </div>

      <Row gutter={[24, 24]}>
        {currentData.map((tree) => (
          <Col key={tree.id} xs={24} sm={12} md={8} lg={6}>
            <TreeCard tree={tree} />
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredList.length}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default TreeListPage;
