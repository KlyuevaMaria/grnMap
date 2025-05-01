import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTreeById, updateTreeById } from "../../store/trees/treeThunks";
import { Card, message, Spin } from "antd";
import TreeForm from "../../components/TreeForm";
import FormCust from "../../components/FormCust";
import EditTreeForm from "../../components/EditTreeForm";

const TreeEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current: tree, loading } = useSelector((state) => state.trees);

  useEffect(() => {
    dispatch(fetchTreeById(id));
  }, [dispatch, id]);

  const handleSubmit = async (values) => {
    const transformed = {
      type: values.type,
      adress: values.adress,
      latitude: values.latitude,
      longitude: values.longitude,
      owner: values.owner,
      height: values.height,
      diameter: values.diameter,
      num_of_bar: values.num_of_bar,
      crown_diameter: values.crown_diameter,
      year: values.year?.year?.() || null,
      status: values.status,        // это строка
      note: values.note,            // id
      env: values.env,              // id
      condition: values.condition,  // id
      description: values.description,
    };
  
    try {
      await dispatch(updateTreeById({ id, data: transformed })).unwrap();
      message.success("Дерево успешно обновлено!");
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
    <div style={{ maxWidth: "900px", margin: "50px auto", padding: "0 20px" }}>
      <Card
        title="Редактирование дерева"
        style={{
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <EditTreeForm initialValues={tree} onFinish={handleSubmit} />
        {/* <TreeForm initialValues={tree} onFinish={handleSubmit} /> */}
      </Card>
    </div>
  );
};

export default TreeEditPage;
