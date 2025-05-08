import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Steps,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Upload,
  Select,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConditions,
  fetchEnvironments,
  fetchSpecialNotes,
  fetchStatuses,
  createTree,
} from "../store/trees/treeThunks";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Step } = Steps;

const AddTreeModal = ({ isOpen, onClose, initialCoords }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { conditions, environments, specialNotes, statuses } = useSelector(
    (state) => state.trees
  );

  const [address, setAddress] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const initialValues = {
    latitude: initialCoords?.lat || 0,
    longitude: initialCoords?.lng || 0,
  };

  useEffect(() => {
    if (initialCoords) {
      const getAddressFromCoords = async (lng, lat) => {
        try {
          setIsLoadingAddress(true);
          const response = await fetch(
            `https://catalog.api.2gis.com/3.0/items/geocode?point=${lng},${lat}&key=592dca93-79b5-47c8-b149-e8bf215b0fd2`
          );
          const data = await response.json();
          return data?.result?.items?.[0]?.full_name || "Адрес не найден";
        } catch {
          return "Ошибка определения адреса";
        } finally {
          setIsLoadingAddress(false);
        }
      };

      const fetchAddress = async () => {
        const addr = await getAddressFromCoords(
          initialCoords.lng,
          initialCoords.lat
        );
        setAddress(addr);
        form.setFieldsValue({
          adress: addr,
          longitude: initialCoords.lng,
          latitude: initialCoords.lat,
        });
      };

      fetchAddress();
    }
  }, [initialCoords, form]);

  useEffect(() => {
    if (address) form.setFieldsValue({ adress: address });
  }, [address, form]);

  useEffect(() => {
    dispatch(fetchConditions());
    dispatch(fetchEnvironments());
    dispatch(fetchSpecialNotes());
    dispatch(fetchStatuses());
  }, [dispatch]);

  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setCurrentStep(0);
      setAddress("");
    }
  }, [isOpen]);

  // const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);
  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && Array.isArray(e.fileList) ? e.fileList : [];
  };

  const beforeUploadPhoto = (file) => {
    const isValidType = ["image/jpeg", "image/png"].includes(file.type);
    const isUnderSize = file.size / 1024 / 1024 < 5;
    if (!isValidType) message.error("Можно загружать только JPG/PNG файлы");
    if (!isUnderSize) message.error("Фото должно быть меньше 5MB");
    return isValidType && isUnderSize ? false : Upload.LIST_IGNORE;
  };

  const beforeUploadDocument = (file) => {
    const allowedTypes = [
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const isAllowed = allowedTypes.includes(file.type);
    const isUnderSize = file.size / 1024 / 1024 < 2;
    if (!isAllowed) message.error("Допустимы только TXT, PDF, DOC, DOCX");
    if (!isUnderSize) message.error("Файл должен быть меньше 2MB");
    return isAllowed && isUnderSize ? false : Upload.LIST_IGNORE;
  };

  const handleNext = async () => {
    try {
      await form.validateFields(stepFields[currentStep]);
      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      console.log("Validation Failed:", err);
    }
  };

  const handlePrev = () => setCurrentStep((prev) => prev - 1);

  const handleFinish = async () => {
    try {
      const values = form.getFieldsValue(true);
      await dispatch(createTree(values)).unwrap();
      message.success("Дерево успешно добавлено!");
      form.resetFields();
      onClose();
    } catch (error) {
      console.error(error);
      message.error("Ошибка при сохранении данных");
    }
  };

  const steps = [
    {
      title: "Общие данные",
      content: (
        <>
          <Form.Item
            name={["type", "name"]}
            label="Тип дерева"
            rules={[{ required: true, message: "Укажите тип дерева" }]}
          >
            <Input placeholder="Клен, Дуб, Сосна..." />
          </Form.Item>
          <Form.Item
            name="adress"
            label="Адрес"
            rules={[{ required: true, message: "Введите адрес" }]}
          >
            <Input
              disabled={isLoadingAddress}
              placeholder="Ближайший к дереву адрес"
            />
          </Form.Item>
          <Form.Item
            name="latitude"
            label="Широта"
            rules={[{ required: true, message: "Введите широту" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Введите координаты широты"
            />
          </Form.Item>
          <Form.Item
            name="longitude"
            label="Долгота"
            rules={[{ required: true, message: "Введите долготу" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Введите координаты долготы"
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Особенности дерева",
      content: (
        <>
          <Form.Item
            name="statusId"
            label="Статус"
            rules={[{ required: true, message: "Выберите статус" }]}
          >
            <Select placeholder="Статус">
              {statuses.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.status_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="environmentId"
            label="Среда"
            rules={[{ required: true, message: "Выберите среду" }]}
          >
            <Select placeholder="Среда">
              {environments.map((e) => (
                <Select.Option key={e.id} value={e.id}>
                  {e.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="specialNoteId"
            label="Особая пометка"
            rules={[{ required: true, message: "Выберите пометку" }]}
          >
            <Select placeholder="Особая пометка">
              {specialNotes.map((n) => (
                <Select.Option key={n.id} value={n.id}>
                  {n.note}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="conditionId"
            label="Состояние"
            rules={[{ required: true, message: "Выберите состояние" }]}
          >
            <Select placeholder="Состояние">
              {conditions.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="owner"
            label="Собственник"
            rules={[{ required: true, message: "Укажите владельца" }]}
          >
            <Input />
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
        </>
      ),
    },
    {
      title: "Характеристики",
      content: (
        <>
          <Form.Item
            name="height"
            label="Высота (см)"
            rules={[{ required: true, message: "Введите высоту" }]}
          >
            <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="diameter"
            label="Диаметр ствола (см)"
            rules={[{ required: true, message: "Введите диаметр" }]}
          >
            <InputNumber min={0} step={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="number_of_barrels"
            label="Количество стволов"
            rules={[{ required: true, message: "Укажите количество" }]}
          >
            <InputNumber min={0} step={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="crown_diameter"
            label="Диаметр кроны (см)"
            rules={[{ required: true, message: "Введите диаметр кроны" }]}
          >
            <InputNumber min={0} step={1} style={{ width: "100%" }} />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Файлы",
      content: (
        <>
          <Form.Item
            name="photo"
            label="Фото дерева"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: "Загрузите фото" }]}
          >
            <Upload
              name="photo"
              listType="picture"
              multiple
              // beforeUpload={beforeUploadPhoto}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Загрузить фото</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="document"
            label="Документы"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            // rules={[{ required: true, message: "Прикрепите документы" }]}
          >
            <Upload
              name="document"
              multiple
              // beforeUpload={beforeUploadDocument}
              beforeUpload={() => false}
              accept=".pdf, .doc, .docx, .txt"
            >
              <Button icon={<UploadOutlined />}>Прикрепить файлы</Button>
            </Upload>
          </Form.Item>
        </>
      ),
    },
  ];

  const stepFields = [
    ["type", "adress", "latitude", "longitude"],
    [
      "statusId",
      "environmentId",
      "specialNoteId",
      "conditionId",
      "owner",
      "year_of_planting",
    ],
    ["height", "diameter", "crown_diameter", "number_of_barrels"],
    ["photo", "document"],
  ];

  return (
    <Modal
      title="Добавить дерево"
      open={isOpen}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={800}
      centered
      destroyOnClose
    >
      <Steps current={currentStep} style={{ marginBottom: "24px" }}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...initialValues,
          plantingDate: initialValues.plantingDate
            ? dayjs(initialValues.plantingDate)
            : null,
          adress: address,
        }}
        onFinish={handleFinish}
      >
        {steps[currentStep].content}
      </Form>

      <div style={{ marginTop: 24, textAlign: "right" }}>
        {currentStep > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={handlePrev}>
            Назад
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button type="primary" onClick={handleNext}>
            Далее
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button
            type="primary"
            onClick={handleFinish}
            style={{
              backgroundColor: "#2c5c3f",
              borderColor: "#2c5c3f",
              height: "45px",
              fontWeight: "bold",
            }}
          >
            Сохранить
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default AddTreeModal;
