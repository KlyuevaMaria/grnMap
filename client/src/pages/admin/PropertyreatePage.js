import {
  Button,
  ConfigProvider,
  Form,
  Input,
  List,
  message,
  Tabs,
  Typography,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createStatus,
  createSpecialNote,
  createEnv,
  createCondition,
  deleteStatus,
  deleteNote,
  deleteEnv,
  deleteCondition,
  updateStatus,
  updateCondition,
  updateEnv,
  updateNote,
} from "../../store/trees/treeAdminThunks";
import {
  fetchConditions,
  fetchEnvironments,
  fetchSpecialNotes,
  fetchStatuses,
} from "../../store/trees/treeThunks";
import Title from "antd/es/typography/Title";

const { TabPane } = Tabs;

const PropertyreatePage = () => {
  const dispatch = useDispatch();
  const { conditions, environments, specialNotes, statuses } = useSelector(
    (state) => state.trees
  );
  const [activeTab, setActiveTab] = useState("status");

  const [forms] = useState({
    status: Form.useForm()[0],
    note: Form.useForm()[0],
    env: Form.useForm()[0],
    condition: Form.useForm()[0],
  });

  const [editItems, setEditItems] = useState({
    status: null,
    note: null,
    env: null,
    condition: null,
  });

  useEffect(() => {
    dispatch(fetchConditions());
    dispatch(fetchEnvironments());
    dispatch(fetchSpecialNotes());
    dispatch(fetchStatuses());
  }, [dispatch]);

  const startEditing = (item, type, fieldName) => {
    setEditItems((prev) => ({ ...prev, [type]: item }));
    const fieldToSet = fieldName === "status_name" ? "name" : fieldName;

    forms[type].setFieldsValue({ [fieldToSet]: item[fieldName] });
  };

  const handleSaveEdit = async (type, fieldName, updateAction, fetchAction) => {
    try {
      const values = await forms[type].validateFields();
      const id = editItems[type].id;
      await dispatch(
        updateAction({ id, [fieldName]: values[fieldName] })
      ).unwrap();
      message.success("Успешно обновлено");
      setEditItems((prev) => ({ ...prev, [type]: null }));
      forms[type].resetFields();
      dispatch(fetchAction());
    } catch (error) {
      message.error(error?.message || "Ошибка при обновлении");
    }
  };

  const handleSubmit = async (values, type, createAction, fetchAction) => {
    try {
      if (editItems[type]) {
        await handleSaveEdit(
          type,
          type === "status" || type === "env" || type === "condition"
            ? "name"
            : type,
          getUpdateAction(type),
          fetchAction
        );
      } else {
        await dispatch(createAction(values[type] || values.name)).unwrap();
        message.success("Успешно добавлено");
        forms[type].resetFields();
        dispatch(fetchAction());
      }
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const handleDelete = async (id, type, fetchAction, deleteAction) => {
    try {
      await dispatch(deleteAction(id)).unwrap();
      message.success("Удалено");
      dispatch(fetchAction());
    } catch (error) {
      message.error("Ошибка при удалении");
    }
  };

  const getUpdateAction = (type) => {
    switch (type) {
      case "status":
        return updateStatus;
      case "note":
        return updateNote;
      case "env":
        return updateEnv;
      case "condition":
        return updateCondition;
      default:
        return () => {};
    }
  };

  const renderList = (data, type, labelKey, fetchAction, deleteAction) => (
    <List
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          key={item.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography.Text>{item[labelKey]}</Typography.Text>
          <div>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                handleDelete(item.id, type, fetchAction, deleteAction)
              }
              style={{ marginRight: "8px" }}
            />
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => startEditing(item, type, labelKey)}
            />
          </div>
        </List.Item>
      )}
    />
  );

  return (
    <div
      style={{
        padding: "40px 20px",
        background: "#F7F4EF",
        minHeight: "100vh",
        fontFamily: "Bitter",
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
        Характеристики деревьев
      </Title>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        items={[
          {
            key: "status",
            label: "Статусы",
            children: (
              <>
                <Form
                  form={forms.status}
                  onFinish={(values) =>
                    handleSubmit(values, "status", createStatus, fetchStatuses)
                  }
                  layout="vertical"
                >
                  <Form.Item
                    name="name"
                    label="Название статуса"
                    rules={[{ required: true, message: "Введите статус" }]}
                  >
                    <Input placeholder="Например: Сохранить" />
                  </Form.Item>
                  <Button
                    htmlType="submit"
                    type="primary"
                    block
                    style={{ marginBottom: 10 }}
                  >
                    {editItems.status
                      ? "Сохранить изменения"
                      : "Добавить статус"}
                  </Button>
                </Form>
                {renderList(
                  statuses,
                  "status",
                  "status_name",
                  fetchStatuses,
                  deleteStatus
                )}
              </>
            ),
          },
          {
            key: "note",
            label: "Особые пометки",
            children: (
              <>
                <Form
                  form={forms.note}
                  onFinish={(values) =>
                    handleSubmit(
                      values,
                      "note",
                      createSpecialNote,
                      fetchSpecialNotes
                    )
                  }
                  layout="vertical"
                >
                  <Form.Item
                    name="note"
                    label="Текст пометки"
                    rules={[{ required: true, message: "Введите пометку" }]}
                  >
                    <Input placeholder="Например: Не пересаживать" />
                  </Form.Item>
                  <Button htmlType="submit" type="primary" block>
                    {editItems.note
                      ? "Сохранить изменения"
                      : "Добавить пометку"}
                  </Button>
                </Form>
                {renderList(
                  specialNotes,
                  "note",
                  "note",
                  fetchSpecialNotes,
                  deleteNote
                )}
              </>
            ),
          },

          {
            key: "env",
            label: "Среды",
            children: (
              <>
                <Form
                  form={forms.env}
                  onFinish={(values) =>
                    handleSubmit(values, "env", createEnv, fetchEnvironments)
                  }
                  layout="vertical"
                >
                  <Form.Item
                    name="name"
                    label="Название среды"
                    rules={[
                      { required: true, message: "Введите название среды" },
                    ]}
                  >
                    <Input placeholder="Например: Парк" />
                  </Form.Item>
                  <Button htmlType="submit" type="primary" block>
                    {editItems.env ? "Сохранить изменения" : "Добавить среду"}
                  </Button>
                </Form>
                {renderList(
                  environments,
                  "env",
                  "name",
                  fetchEnvironments,
                  deleteEnv
                )}
              </>
            ),
          },

          {
            key: "condition",
            label: "Состояния",
            children: (
              <>
                <Form
                  form={forms.condition}
                  onFinish={(values) =>
                    handleSubmit(
                      values,
                      "condition",
                      createCondition,
                      fetchConditions
                    )
                  }
                  layout="vertical"
                >
                  <Form.Item
                    name="name"
                    label="Название состояния"
                    rules={[
                      { required: true, message: "Введите название состояния" },
                    ]}
                  >
                    <Input placeholder="Например: Удовлетворительное" />
                  </Form.Item>
                  <Button htmlType="submit" type="primary" block>
                    {editItems.condition
                      ? "Сохранить изменения"
                      : "Добавить состояние"}
                  </Button>
                </Form>
                {renderList(
                  conditions,
                  "condition",
                  "name",
                  fetchConditions,
                  deleteCondition
                )}
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default PropertyreatePage;
