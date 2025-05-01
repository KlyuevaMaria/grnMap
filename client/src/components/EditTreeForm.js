import React, { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConditions,
  fetchEnvironments,
  fetchSpecialNotes,
  fetchStatuses,
} from "../store/trees/treeThunks";

const { TextArea } = Input;

const EditTreeForm = ({ initialValues = {}, onFinish }) => {
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

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && Array.isArray(e.fileList) ? e.fileList : [];
  };

  const mapFile = (file, pathPrefix) => [
    {
      uid: "-1",
      name: file.name,
      status: "done",
      url: `http://localhost:8080/static/${pathPrefix}/${file.name}`,
    },
  ];

  const transformedInitialValues = {
    ...initialValues,
    num_of_bar:initialValues.number_of_barrels,
    status: initialValues.status?.status_name,
    note: initialValues.special_note?.note,
    env: initialValues.environment?.name,
    condition: initialValues.condition?.name,
    // year: initialValues?.year_of_planting
    //   ? dayjs(String(initialValues.year_of_planting), "YYYY")
    //   : null,
    year: initialValues.year_of_planting
  ? dayjs(initialValues.year_of_planting.toString(), "YYYY")
  : null,
    photo: initialValues.photo ? mapFile(initialValues.photo, "photo") : [],
    document: initialValues.document
      ? mapFile(initialValues.document, "documents")
      : [],
  };
  console.log("transformedInitialValues", transformedInitialValues);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={transformedInitialValues}
      style={{ maxWidth: "600px", margin: "0 auto" }}
    >
      <Form.Item
        name="type"
        label="Тип дерева"
        rules={[{ required: true, message: "Укажите тип дерева" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="adress"
        label="Адрес"
        rules={[{ required: true, message: "Введите адрес" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="latitude" label="Координаты широты">
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="longitude" label="Координаты долготы">
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="owner"
        label="Собственник"
        rules={[{ required: true, message: "Введите владельца" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="height" label="Высота (м)">
        <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="diameter" label="Диаметр ствола (м)">
        <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="num_of_bar" label="Количество стволов">
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="crown_diameter" label="Диаметр кроны (м)">
        <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="year" label="Год посадки">
        <DatePicker picker="year" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="status" label="Статус">
        <Select>
          {statuses.map((item) => (
            <Select.Option key={item.id} value={item.status_name}>
              {item.status_name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="note" label="Особые пометки">
        <Select allowClear>
          {specialNotes.map((note) => (
            <Select.Option key={note.id} value={note.note}>
              {note.note}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="env" label="Среда произрастания">
        <Select allowClear>
          {environments.map((env) => (
            <Select.Option key={env.id} value={env.name}>
              {env.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="condition"
        label="Состояние"
        rules={[{ required: true, message: "Укажите состояние" }]}
      >
        <Select>
          {conditions.map((cond) => (
            <Select.Option key={cond.id} value={cond.name}>
              {cond.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="description" label="Описание">
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="photo"
        label="Фото дерева"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          name="photo"
          listType="picture"
          beforeUpload={() => false} // disable upload
        >
          <Button icon={<UploadOutlined />}>Загрузить фото</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="document"
        label="Дополнительные файлы"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload name="document" multiple beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Прикрепить файлы</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Сохранить изменения
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditTreeForm;
