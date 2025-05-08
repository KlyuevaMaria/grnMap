import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTreeById, updateTreeById } from "../../store/trees/treeThunks";
import { Card, message, Spin } from "antd";
import EditTreeForm from "../../components/EditTreeForm";
import Title from "antd/es/typography/Title";

const TreeEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current: tree, loading } = useSelector((state) => state.trees);

  useEffect(() => {
    dispatch(fetchTreeById(id));
  }, [dispatch, id]);

  const handleSubmit = async ({
    removedPhotos,
    removedDocuments,
    ...values
  }) => {
    const formData = new FormData();

    formData.append("type", values.type);
    formData.append("adress", values.adress);
    formData.append("latitude", values.latitude);
    formData.append("longitude", values.longitude);
    formData.append("owner", values.owner);
    formData.append("height", values.height);
    formData.append("diameter", values.diameter);
    formData.append("num_of_bar", values.num_of_bar);
    formData.append("crown_diameter", values.crown_diameter);
    formData.append("year", values.year?.year() || ""); // DatePicker → year
    formData.append("status", values.status || "");
    formData.append("note", values.note || "");
    formData.append("env", values.env || "");
    formData.append("condition", values.condition || "");
    formData.append("description", values.description || "");
    // Удалённые
    formData.append("removedPhotos", JSON.stringify(removedPhotos));
    formData.append("removedDocuments", JSON.stringify(removedDocuments));

    // Загрузка новых фото
    values.photo?.forEach((file) => {
      if (file.originFileObj) {
        formData.append("newPhotos", file.originFileObj);
      }
    });

    // Загрузка новых документов
    values.document?.forEach((file) => {
      if (file.originFileObj) {
        formData.append("newDocuments", file.originFileObj);
      }
    });

    try {
      await dispatch(updateTreeById({ id, data: formData })).unwrap();
      message.success("Дерево успешно обновлено!");
      // setRemovedPhotos([]);
      // setRemovedDocuments([]);
      navigate(`/tree/${id}`);
    } catch (error) {
      console.error("Ошибка:", error);
      message.error(error?.response?.data?.message || "Ошибка обновления");
    }
  };

  if (loading || !tree) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "100px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "60px auto",
        padding: "40px 20px",
        background: "#F7F4EF",
        borderRadius: "12px",
        fontFamily: "'Bitter', serif",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <Title
        level={2}
        style={{
          textAlign: "center",
          color: "#D5573B",
          fontFamily: "'Poiret One', cursive",
          marginBottom: "30px",
        }}
      >
        Редактирование дерева
      </Title>
      <Card
        title="Редактирование дерева"
        style={{
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <EditTreeForm initialValues={tree} onFinish={handleSubmit} />     

      </Card>
    </div>
  );
};

export default TreeEditPage;
