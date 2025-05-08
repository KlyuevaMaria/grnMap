import React, { useEffect } from "react";
import { Card, List, Collapse, Spin, Tabs, Typography } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAppeals } from "../store/appealAdminThunks";
import TabPane from "antd/es/tabs/TabPane";
import AllAppeals from "../components/AllAppeals";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const Current = () => {
  const dispatch = useDispatch();
  // const { responses, loading, error } = useSelector((state) => state.appeals);
  const { appeals, loading } = useSelector((state) => state.adminAppeals);

  useEffect(() => {
    dispatch(fetchAllAppeals());
  }, [dispatch]);

  useEffect(() => {
    console.log("Обновлённые ответы:", appeals);
  }, [appeals]);

  return (
    <div
      style={{
        padding: "40px 20px",
        background: "#F7F4EF",
        minHeight: "100vh",
        fontFamily: "'Bitter', serif",
      }}
    >
      {" "}
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Новости" key="1">
          <p>Здесь скоро появятся актуальные новости 🌿</p>
        </TabPane>
        <TabPane tab="Работы" key="2">
          <p>Информация о предстоящих работах будет добавлена...</p>
        </TabPane>
        <TabPane tab="Обращения пользователей" key="3">
          <AllAppeals />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Current;
