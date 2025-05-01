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

  const [address, setAddress] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const dispatch = useDispatch();
  const { conditions, environments, specialNotes, statuses } = useSelector(
    (state) => state.trees
  );

  const [currentStep, setCurrentStep] = useState(0);

  const initialValues = {
    // adress: initialAddress || "",
    latitude: initialCoords?.lat || 0,
    longitude: initialCoords?.lng || 0,
  };
  useEffect(() => {
    const getAddressFromCoords = async (longitude, latitude) => {
      try {
        setIsLoadingAddress(true);
        const response = await fetch(
          `https://catalog.api.2gis.com/3.0/items/geocode?point=${longitude},${latitude}&key=592dca93-79b5-47c8-b149-e8bf215b0fd2`
        );
        const data = await response.json();
        if (data?.result?.items?.length > 0) {
          console.log("Адрес не найден", data);

          return data.result.items[0].full_name;
        }

        return "Адрес не найден";
      } catch (error) {
        console.error("Ошибка при получении адреса:", error);
        return "Ошибка определения адреса";
      } finally {
        setIsLoadingAddress(false);
      }
    };

    if (initialCoords) {
      const fetchAddress = async () => {
        const addr = await getAddressFromCoords(
          initialCoords.lng,
          initialCoords.lat
        );
        setAddress(addr);
        form.setFieldsValue({ adress: addr }); // 🛠️ ВОТ ЭТО ДОБАВЬ
      };
      fetchAddress();
    }
  }, [initialCoords, form]);

  useEffect(() => {
    if (address) {
      form.setFieldsValue({ adress: address });
    }
  }, [address, form]);

  useEffect(() => {
    dispatch(fetchConditions());
    dispatch(fetchEnvironments());
    dispatch(fetchSpecialNotes());
    dispatch(fetchStatuses());
  }, [dispatch]);

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList);

  const beforeUpploadPhoto = (photo) => {
    const isJpgOrPng =
      photo.type === "image/jpeg" || photo.type === "image/png";
    const isFileUnder5MB = photo.size / 1024 / 1024 < 5;
    if (!isJpgOrPng) message.error("Можно загружать только JPG/PNG файлы");
    if (!isFileUnder5MB) message.error("Фото должно быть меньше 5MB");
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
    if (!isAllowed)
      message.error("Можно загружать только TXT, PDF, DOC или DOCX файлы");
    if (!isFileUnder2MB) message.error("Документ должен быть меньше 2MB");
    return isAllowed && isFileUnder2MB ? false : Upload.LIST_IGNORE;
  };

  const handleNext = async () => {
    try {
      await form.validateFields(stepFields[currentStep]);
      setCurrentStep((prev) => prev + 1);
    } catch (err) {
      console.log("Validation Failed:", err);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFinish = async () => {
    try {
      // const values = await form.validateFields();
      const values = form.getFieldsValue(true);

      console.log("🟢 VALID VALUES:", values);

      // const formData = new FormData();

      // formData.append("type", values?.type?.name || "");
      // formData.append("adress", values.adress || "");
      // formData.append("latitude", values.latitude || 0);
      // formData.append("longitude", values.longitude || 0);
      // formData.append("statusId", values.statusId || "");
      // formData.append("envId", values.envId || "");
      // formData.append("specialNoteId", values.specialNoteId || "");
      // formData.append("conditionId", values.conditionId || "");
      // formData.append("owner", values.owner || "");
      // formData.append("year", values.year_of_planting?.year() || "");
      // formData.append("height", values.height || 0);
      // formData.append("diameter", values.diameter || 0);
      // formData.append("number_of_barrels", values.number_of_barrels || 0);
      // formData.append("crown_diameter", values.crown_diameter || 0);
      // formData.append("description", values.description || "");

      // if (values.photo && values.photo.length > 0) {
      //   formData.append("photo", values.photo[0].originFileObj);
      // }

      // if (values.document && values.document.length > 0) {
      //   formData.append("document", values.document[0].originFileObj);
      // }

      await dispatch(createTree(values)).unwrap();
      console.log(values);

      message.success("Дерево успешно добавлено!");
      form.resetFields();
      onClose();
    } catch (error) {
      console.error(error);
      console.log("🔴 Validation failed:", error);

      message.error(error.response.data.message);
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
            rules={[
              { required: true, message: "Пожалуйста, укажите тип дерева" },
            ]}
          >
            <Input placeholder="Клен, Дуб, Сосна..." />
          </Form.Item>

          <Form.Item
            name="adress"
            label="Адрес"
            rules={[{ required: true, message: "Введите адрес" }]}
          >
            <Input
              placeholder="Адрес посадки дерева"
              loading={isLoadingAddress}
              disabled={isLoadingAddress}
            />
          </Form.Item>

          <Form.Item name="latitude" label="Координаты широты">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Введите широту"
            />
          </Form.Item>

          <Form.Item name="longitude" label="Координаты долготы">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Введите долготу"
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Особенности дерева",
      content: (
        <>
          <Form.Item name="statusId" label="Статус">
            <Select placeholder="Выберите статус">
              {statuses.map((status) => (
                <Select.Option key={status.id} value={status.id}>
                  {status.status_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="environmentId" label="Среда произрастания">
            <Select placeholder="Выберите среду">
              {environments.map((env) => (
                <Select.Option key={env.id} value={env.id}>
                  {env.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="specialNoteId" label="Особые пометки">
            <Select placeholder="Выберите пометку">
              {specialNotes.map((note) => (
                <Select.Option key={note.id} value={note.id}>
                  {note.note}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="conditionId" label="Состояние">
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
            <Input placeholder="Введите владельца" />
          </Form.Item>

          <Form.Item name="year_of_planting" label="Год посадки">
            <DatePicker picker="year" style={{ width: "100%" }} />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Характеристики",
      content: (
        <>
          <Form.Item name="height" label="Высота (м)">
            <InputNumber
              min={0}
              step={0.1}
              style={{ width: "100%" }}
              placeholder="Высота"
            />
          </Form.Item>

          <Form.Item name="diameter" label="Диаметр ствола (см)">
            <InputNumber
              min={0}
              step={1}
              style={{ width: "100%" }}
              placeholder="Диаметр"
            />
          </Form.Item>

          <Form.Item name="number_of_barrels" label="Количество стволов (шт)">
            <InputNumber
              min={0}
              step={1}
              style={{ width: "100%" }}
              placeholder="Количество стволов"
            />
          </Form.Item>

          <Form.Item name="crown_diameter" label="Диаметр кроны (м)">
            <InputNumber
              min={0}
              step={1}
              style={{ width: "100%" }}
              placeholder="Диаметр кроны"
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Файлы",
      content: (
        <>
          <Form.Item name="description" label="Описание">
            <TextArea rows={3} placeholder="Дополнительная информация" />
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
              beforeUpload={beforeUpploadPhoto}
            >
              <Button icon={<UploadOutlined />}>Загрузить фото</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="document"
            label="Дополнительные файлы"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              { required: true, message: "Пожалуйста, прикрепите документ" },
            ]}
          >
            <Upload
              name="document"
              multiple
              beforeUpload={beforeUpploadDocument}
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
      "envId",
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
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      // destroyOnClose
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
        isLoadingAddress={isLoadingAddress}
        onFinish={handleFinish} // <--- добавь это!
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
            htmlType="submit"
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
