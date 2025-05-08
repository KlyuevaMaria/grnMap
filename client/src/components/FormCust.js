import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  Input,
  Button,
  InputNumber,
  DatePicker,
  Upload,
  Select,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import {
  createTree,
  fetchConditions,
  fetchEnvironments,
  fetchSpecialNotes,
  fetchStatuses,
} from "../store/trees/treeThunks";
import { current } from "@reduxjs/toolkit";

const { TextArea } = Input;

const FormCust = ({ initialValues = {} }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Тянем списки из стейта
  const { conditions, environments, specialNotes, statuses } = useSelector(
    (state) => state.trees
  );

  useEffect(() => {
    dispatch(fetchConditions());
    dispatch(fetchEnvironments());
    dispatch(fetchSpecialNotes());
    dispatch(fetchStatuses());
  }, [dispatch]);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && Array.isArray(e.fileList) ? e.fileList : [];
  };

  const beforeUpploadPhoto = (photo) => {
    const isJpgOrPng =
      photo.type === "image/jpeg" || photo.type === "image/png";
    const isFileUnder5MB = photo.size / 1024 / 1024 < 5;
    if (!isJpgOrPng) {
      message.error("Можно загружать только JPG/PNG файлы");
    }
    if (!isFileUnder5MB) {
      message.error("Фото должно быть меньше 5MB");
    }
    return isJpgOrPng && isFileUnder5MB ? false : Upload.LIST_IGNORE;
  };

  const beforeUpploadDocument = (file) => {
    const allowedTypes = [
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const isAllowed = allowedTypes.includes(file.type);
    const isFileUnder2MB = file.size / 1024 / 1024 < 2;

    if (!isAllowed) {
      message.error("Можно загружать только TXT, PDF, DOC или DOCX файлы");
    }
    if (!isFileUnder2MB) {
      message.error("Документ должно быть меньше 2MB");
    }
    return isAllowed && isFileUnder2MB ? false : Upload.LIST_IGNORE;
  };

  const onFinish = (values) => {
    const transformedValues = {
      ...values,
      year_of_planting: values.year_of_planting
        ? values.year_of_planting
        : null,
    };
    console.log("______", transformedValues);

    dispatch(createTree(transformedValues))
      .unwrap()
      .then((res) => {
        message.success("Дерево успешно добавлено!");
        form.resetFields();
      })
      .catch((err) => {
        console.error("Ошибка:", err);
        message.error(err?.message || "Ошибка при добавлении дерева");
      });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...initialValues,
        year_of_planting: initialValues.year_of_planting
          ? dayjs(initialValues.year_of_planting, "YYYY")
          : null,
      }}
      onFinish={onFinish}
      style={{ maxWidth: "600px", margin: "0 auto" }}
    >
      <Form.Item
        name={["type", "name"]}
        label="Тип дерева"
        rules={[{ required: true, message: "Пожалуйста, укажите тип дерева" }]}
      >
        <Input placeholder="Например: Клен, Дуб, Сосна..." />
      </Form.Item>

      <Form.Item
        name="adress"
        label="Адрес"
        rules={[{ required: true, message: "Введите адрес" }]}
      >
        <Input placeholder="Ближайший к дереву адрес" />
      </Form.Item>

      <Form.Item
        name="latitude"
        label="Координаты широты"
        rules={[{ required: true, message: "Введите широту" }]}
      >
        <InputNumber
          min={0}
          step={1}
          style={{ width: "100%" }}
          placeholder="Введите координаты широты"
        />
      </Form.Item>

      <Form.Item
        name="longitude"
        label="Координаты долготы"
        rules={[{ required: true, message: "Введите долготу" }]}
      >
        <InputNumber
          min={0}
          step={1}
          style={{ width: "100%" }}
          placeholder="Введите координаты долготы"
        />
      </Form.Item>

      <Form.Item
        name="statusId"
        label="Статус"
        rules={[{ required: true, message: "Выберите статус" }]}
      >
        <Select placeholder="Выберите статус">
          {statuses.map((status) => (
            <Select.Option key={status.id} value={status.id}>
              {status.status_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="specialNoteId"
        label="Особые пометки"
        rules={[{ required: true, message: "Выберите пометку" }]}
      >
        <Select placeholder="Выберите пометку">
          {specialNotes.map((note) => (
            <Select.Option key={note.id} value={note.id}>
              {note.note}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="environmentId"
        label="Среда произрастания"
        rules={[{ required: true, message: "Выберите среду" }]}
      >
        <Select placeholder="Выберите среду">
          {environments.map((env) => (
            <Select.Option key={env.id} value={env.id}>
              {env.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="conditionId"
        label="Состояние"
        rules={[{ required: true, message: "Укажите состояние" }]}
      >
        <Select placeholder="Выберите состояние">
          {conditions.map((cond) => (
            <Select.Option key={cond.id} value={cond.id}>
              {cond.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="owner"
        label="Собственник"
        rules={[{ required: true, message: "Введите владельца" }]}
      >
        <Input placeholder="Собственник" />
      </Form.Item>

      <Form.Item
        name="year_of_planting"
        label="Год посадки"
        rules={[{ required: true, message: "Укажите год посадки" }]}
      >
        <DatePicker
          picker="year"
          style={{ width: "100%" }}
          disabledDate={(current) =>
            current && current.year() > new Date().getFullYear()
          }
        />
      </Form.Item>
      
      <Form.Item
        name="height"
        label="Высота (см)"
        rules={[{ required: true, message: "Введите высоту" }]}
      >
        <InputNumber
          min={0}
          step={0.1}
          style={{ width: "100%" }}
          placeholder="Введите высоту"
        />
      </Form.Item>

      <Form.Item
        name="diameter"
        label="Диаметр ствола (см)"
        rules={[{ required: true, message: "Введите диаметр" }]}
      >
        <InputNumber
          min={0}
          step={1}
          style={{ width: "100%" }}
          placeholder="Введите диаметр"
        />
      </Form.Item>

      <Form.Item
        name="number_of_barrels"
        label="Количество стволов (шт)"
        rules={[{ required: true, message: "Укажите количество" }]}
      >
        <InputNumber
          min={0}
          step={1}
          style={{ width: "100%" }}
          placeholder="Введите количество стволов"
        />
      </Form.Item>

      <Form.Item
        name="crown_diameter"
        label="Диаметр кроны (см)"
        rules={[{ required: true, message: "Введите диаметр кроны" }]}
      >
        <InputNumber
          min={0}
          step={1}
          style={{ width: "100%" }}
          placeholder="Введите диаметр"
        />
      </Form.Item>

      <Form.Item
        name="photo"
        label="Фото дерева"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[
          { required: true, message: "Пожалуйста, загрузите фото дерева" },
        ]}
      >
        <Upload
          name="photo"
          listType="picture"
          multiple
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Загрузить фото</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="document"
        label="Дополнительные файлы"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        // rules={[{ required: true, message: "Пожалуйста, прикрепите документ" }]}
      >
        <Upload
          name="document"
          multiple
          beforeUpload={() => false}
          accept=".pdf, .doc, .docx, .txt"
        >
          <Button icon={<UploadOutlined />}>Прикрепить файлы</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Сохранить
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormCust;
