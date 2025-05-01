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
  fetchConditions,
  fetchEnvironments,
  fetchSpecialNotes,
  fetchStatuses,
} from "../store/trees/treeThunks";

const { TextArea } = Input;

const TreeForm = ({
  initialValues = {},
  onFinishSuccess,
  stepFields = null, // <<< Добавлено
  showNextButton = false, // <<< Добавлено
  isLastStep = false, // <<< Добавлено
  isLoadingAddress = false,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { conditions, environments, specialNotes, statuses } = useSelector(
    (state) => state.trees
  );

  useEffect(() => {
    dispatch(fetchConditions());
    dispatch(fetchEnvironments());
    dispatch(fetchSpecialNotes());
    dispatch(fetchStatuses());
  }, [dispatch]);

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

  const beforeUploadPhoto = (photo) => {
    const isJpgOrPng =
      photo.type === "image/jpeg" || photo.type === "image/png";
    const isFileUnder5MB = photo.size / 1024 / 1024 < 5;
    if (!isJpgOrPng) message.error("Можно загружать только JPG/PNG файлы");
    if (!isFileUnder5MB) message.error("Фото должно быть меньше 5MB");
    return isJpgOrPng && isFileUnder5MB ? false : Upload.LIST_IGNORE;
  };

  const beforeUploadDocument = (file) => {
    const allowedTypes = [
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const isAllowed = allowedTypes.includes(file.type);
    const isFileUnder2MB = file.size / 1024 / 1024 < 2;
    if (!isAllowed) message.error("Разрешены только TXT, PDF, DOC, DOCX");
    if (!isFileUnder2MB) message.error("Файл должен быть меньше 2MB");
    return isAllowed && isFileUnder2MB ? false : Upload.LIST_IGNORE;
  };

  const onFinish = (values) => {
    if (onFinishSuccess) {
      onFinishSuccess(values); // для шагов
    }
  };

  const shouldShowField = (name) => {
    if (!stepFields) return true;
    return stepFields.includes(name);
  };


  
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...initialValues,
        plantingDate: initialValues.plantingDate
          ? dayjs(initialValues.plantingDate)
          : null,
      }}
      onFinish={onFinish}
      style={{ maxWidth: "600px", margin: "0 auto" }}
    >
      {shouldShowField("type") && (
        <Form.Item
          name={["type"]}
          label="Тип дерева"
          rules={[
            { required: true, message: "Пожалуйста, укажите тип дерева" },
          ]}
        >
          <Input placeholder="Например: Клен, Дуб, Сосна..." />
        </Form.Item>
      )}

      {shouldShowField("adress") && (
        <Form.Item
          name="adress"
          label="Адрес"
          rules={[{ required: true, message: "Введите адрес" }]}
        >
          <Input
            placeholder="Адрес посадки дерева"
          />
        </Form.Item>
      )}

      {shouldShowField("latitude") && (
        <Form.Item name="latitude" label="Координаты широты">
          <InputNumber min={0} step={0.000001} style={{ width: "100%" }} />
        </Form.Item>
      )}

      {shouldShowField("longitude") && (
        <Form.Item name="longitude" label="Координаты долготы">
          <InputNumber min={0} step={0.000001} style={{ width: "100%" }} />
        </Form.Item>
      )}

      {shouldShowField("owner") && (
        <Form.Item
          name="owner"
          label="Собственник"
          rules={[{ required: true, message: "Введите владельца" }]}
        >
          <Input placeholder="Собственник" />
        </Form.Item>
      )}

      {shouldShowField("height") && (
        <Form.Item name="height" label="Высота (м)">
          <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
        </Form.Item>
      )}

      {shouldShowField("diameter") && (
        <Form.Item name="diameter" label="Диаметр ствола (см)">
          <InputNumber min={0} step={1} style={{ width: "100%" }} />
        </Form.Item>
      )}

      {shouldShowField("number_of_barrels") && (
        <Form.Item name="number_of_barrels" label="Количество стволов">
          <InputNumber min={0} step={1} style={{ width: "100%" }} />
        </Form.Item>
      )}

      {shouldShowField("crown_diameter") && (
        <Form.Item name="crown_diameter" label="Диаметр кроны (м)">
          <InputNumber min={0} step={1} style={{ width: "100%" }} />
        </Form.Item>
      )}

      {shouldShowField("year_of_planting") && (
        <Form.Item name="year_of_planting" label="Год посадки">
          <DatePicker picker="year" style={{ width: "100%" }} />
        </Form.Item>
      )}

      {shouldShowField("statusId") && (
        <Form.Item name={["statusId"]} label="Статус">
          <Select placeholder="Выберите статус">
            {statuses.map((s) => (
              <Select.Option key={s.id} value={s.id}>
                {s.status_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

      {shouldShowField("specialNoteId") && (
        <Form.Item name={["nspecialNoteId"]} label="Особые пометки">
          <Select placeholder="Выберите пометку">
            {specialNotes.map((n) => (
              <Select.Option key={n.id} value={n.id}>
                {n.note}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

      {shouldShowField("envId") && (
        <Form.Item name={["envId"]} label="Среда произрастания">
          <Select placeholder="Выберите среду">
            {environments.map((e) => (
              <Select.Option key={e.id} value={e.id}>
                {e.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

      {shouldShowField("condition") && (
        <Form.Item
          name={["condition", "id"]}
          label="Состояние"
          rules={[{ required: true, message: "Укажите состояние" }]}
        >
          <Select placeholder="Выберите состояние">
            {conditions.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

      {shouldShowField("description") && (
        <Form.Item name="description" label="Описание">
          <TextArea rows={4} />
        </Form.Item>
      )}

      {shouldShowField("photo") && (
        <Form.Item
          name="photo"
          label="Фото дерева"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Пожалуйста, загрузите фото" }]}
        >
          <Upload listType="picture" beforeUpload={beforeUploadPhoto}>
            <Button icon={<UploadOutlined />}>Загрузить фото</Button>
          </Upload>
        </Form.Item>
      )}

      {shouldShowField("document") && (
        <Form.Item
          name="document"
          label="Документы"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Прикрепите документ" }]}
        >
          <Upload multiple beforeUpload={beforeUploadDocument}>
            <Button icon={<UploadOutlined />}>Прикрепить документы</Button>
          </Upload>
        </Form.Item>
      )}

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          style={{
            backgroundColor: "#2c5c3f",
            borderColor: "#2c5c3f",
            height: "45px",
            fontWeight: "bold",
          }}
        >
          {showNextButton ? "Далее" : isLastStep ? "Сохранить" : "Отправить"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TreeForm;
