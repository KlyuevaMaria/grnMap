import React, { useEffect, useState } from "react";
import { Card, List, Collapse, Spin, Tabs, Typography, Select } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAppeals } from "../store/appealAdminThunks";
import { Content } from "antd/es/layout/layout";
import Search from "antd/es/transfer/search";
import Highlighter from "react-highlight-words";
const { Option } = Select;

const { Title, Text } = Typography;
const { Panel } = Collapse;

const AllAppeals = () => {
  const dispatch = useDispatch();
  const { appeals, loading } = useSelector((state) => state.adminAppeals);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(fetchAllAppeals());
  }, [dispatch]);

  // Фильтрация
  const filteredAppeals = appeals
    .filter((appeal) => {
      if (filterStatus === "resolved") return appeal.response;
      if (filterStatus === "received") return !appeal.response;
      return true;
    })
    .filter((appeal) =>
      appeal.description.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return (
    <Content>
      <Title
        level={3}
        style={{
          fontFamily: "'Poiret One', cursive",
          color: "#D5573B",
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        Обращения и ответы
      </Title>

      <div
        style={{
          marginBottom: 20,
          display: "flex",
          // flexWrap: "wrap",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: 200 }}
        >
          <Option value="all">Все обращения</Option>
          <Option value="resolved">Только с ответом</Option>
          <Option value="received">Только без ответа</Option>
        </Select>

        <Search
          placeholder="Поиск по описанию..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ maxWidth: 300 }}
        />
      </div>
      {loading ? (
        <Spin />
      ) : (
        <List
          dataSource={filteredAppeals}
          pagination={{
            pageSize: 6,
            showSizeChanger: false,
          }}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 3,
          }}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={
                  <span>
                    <MessageOutlined style={{ marginRight: 8 }} />
                    От пользователя: {item.user?.name} {item.user?.surname}
                  </span>
                }
                style={{
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <Text strong>Описание обращения:</Text>
                <Highlighter
                  highlightStyle={{ backgroundColor: "#F8C7CC", padding: 0 }}
                  searchWords={[searchText]}
                  autoEscape={true}
                  textToHighlight={item.description}
                />

                {item.response ? (
                  <Collapse ghost>
                    <Panel header="Показать ответ" key="1">
                      <Text strong>Ответ:</Text>
                      <p>{item.response.description}</p>
                      <Text type="secondary">
                        Ответил: {item.response.user?.name}{" "}
                        {item.response.user?.surname}
                      </Text>
                    </Panel>
                  </Collapse>
                ) : (
                  <div>
                    <br />
                    <Text type="secondary">Ответ пока не дан</Text>
                  </div>
                )}
              </Card>
            </List.Item>
          )}
        />
      )}
    </Content>
  );
};

export default AllAppeals;
