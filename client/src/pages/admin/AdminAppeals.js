import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Input, message, Spin } from "antd";
import { fetchAllAppeals, replyToAppeal } from "../../store/appealAdminThunks";
import Highlighter from "react-highlight-words"; // для подсветки поиска
import { SearchOutlined } from "@ant-design/icons";

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
      await dispatch(replyToAppeal({ appealId: selectedAppeal.id, description: replyText })).unwrap();
      message.success("Ответ отправлен!");
      setIsModalOpen(false);
      setReplyText("");
      dispatch(fetchAllAppeals());
    } catch (error) {
      console.error(error);
      message.error("Ошибка при отправке ответа");
    }
  };

  // --- Функции для поиска ---
  let searchInput;
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Поиск по ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Найти
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Сбросить
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : "",
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
      key: "description",
      ...getColumnSearchProps("description"),
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (record.response ? "Отвечено" : "Открыто"),
      filters: [
        { text: "Открыто", value: "Открыто" },
        { text: "Отвечено", value: "Отвечено" },
      ],
      onFilter: (value, record) => (record.response ? "Отвечено" : "Открыто") === value,
    },
    {
      title: "Дата создания",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1,
      defaultSortOrder: "descend", // Сначала новые
    },
    {
      title: "Действия",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          style={{ backgroundColor: "#2c5c3f", borderColor: "#2c5c3f" }}
          onClick={() => handleReplyClick(record)}
          disabled={record.response} // запретить повторный ответ
        >
          Ответить
        </Button>
      ),
    },
  ];

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "100px auto" }} />;
  }

  return (
    <>
      <h2 style={{ marginBottom: "24px" }}>Обращения пользователей</h2>
      <Table
        dataSource={appeals}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
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
    </>
  );
};

export default AdminAppeals;
