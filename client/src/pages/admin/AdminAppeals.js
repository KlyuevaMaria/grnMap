import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Input, message, Spin, Tag } from "antd";
import { fetchAllAppeals, replyToAppeal } from "../../store/appealAdminThunks";
import Highlighter from "react-highlight-words"; // для подсветки поиска
import { SearchOutlined } from "@ant-design/icons";
import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import Search from "antd/es/transfer/search";

const { TextArea } = Input;

const AdminAppeals = () => {
  const dispatch = useDispatch();
  const { appeals, loading } = useSelector((state) => state.adminAppeals);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppeal, setSelectedAppeal] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Для поиска
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  useEffect(() => {
    dispatch(fetchAllAppeals());
  }, [dispatch]);

  const handleReplyClick = (appeal) => {
    setSelectedAppeal(appeal);
    setIsModalOpen(true);
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      message.warning("Введите ответ перед отправкой!");
      return;
    }

    try {
      await dispatch(
        replyToAppeal({ appealId: selectedAppeal.id, description: replyText })
      ).unwrap();
      message.success("Ответ отправлен!");
      setIsModalOpen(false);
      setReplyText("");
      dispatch(fetchAllAppeals());
    } catch (error) {
      console.error(error);
      message.error("Ошибка при отправке ответа");
    }
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

  // --- Колонки ---
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Пользователь",
      dataIndex: "userName",
      key: "userName",
      render: (_, record) => record.user?.name || "Неизвестный",
    },
    {
      title: "Описание обращения",
      dataIndex: "description",
      width:300,
      ellipsis:true,
      render: (text) => (
        <Highlighter
          highlightStyle={{ backgroundColor: "#F8C7CC", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ),
    },
    {
      title: "Ответ",
      dataIndex: "response",
      key: "response",
      width:300,

      render: (response) =>
        response?.description || (
          <span style={{ color: "#999" }}>Нет ответа</span>
        ),
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (_, record) =>
        getStatusTag(record.response ? "resolved" : "received"),
      filters: [
        { text: "Открыто", value: "Открыто" },
        { text: "Отвечено", value: "Отвечено" },
      ],
      onFilter: (value, record) =>
        (record.response ? "Отвечено" : "Открыто") === value,
    },
    {
      title: "Дата",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) =>
        new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1,
      defaultSortOrder: "descend", // Сначала новые
    },
    {
      title: "Действия",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          // style={{ backgroundColor: "#F8C7CC", borderColor: "#F8C7CC" }}
          onClick={() => handleReplyClick(record)}
          disabled={record.response} // запретить повторный ответ
        >
          Ответить
        </Button>
      ),
    },
  ];

  const filteredData = appeals.filter((item) =>
    item.description.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
    );
  }

  return (
    <div
      style={{
        padding: "40px 20px",
        background: "#F7F4EF",
        minHeight: "100vh",
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
        Обращения пользователей
      </Title>
      {/* <Input
        placeholder="Поиск обращений"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 400 }}
        allowClear
      /> */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Search
          placeholder="Поиск обращений"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ maxWidth: 400, flex: 1 }}
        />
      </div>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: "max-content" }}
      />
      <Modal
        title={`Ответ на обращение №${selectedAppeal?.id}`}
        open={isModalOpen}
        onOk={handleSendReply}
        onCancel={() => {
          setIsModalOpen(false);
          setReplyText("");
        }}
        okText="Отправить"
        cancelText="Отмена"
      >
        <TextArea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          rows={4}
          placeholder="Введите ваш ответ..."
        />
      </Modal>
    </div>
  );
};

export default AdminAppeals;
