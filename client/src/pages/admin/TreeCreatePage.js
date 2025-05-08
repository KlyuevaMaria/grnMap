import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { createTree } from "../../store/trees/treeThunks"; // Предположим, у тебя есть createTree
import TreeForm from "../../components/TreeForm";
import FormCust from "../../components/FormCust";
import Title from "antd/es/typography/Title";

const TreeCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    // const actionResult = await dispatch(createTree(values));
    // if (createTree.fulfilled.match(actionResult)) {
    navigate("/admin/trees");
    // }
  };

  return (
    <div>
      <Title
        level={1}
        style={{
          textAlign: "center",
          margin: "30px",
          color: "#D5573B",
          fontFamily: "Poiret One",
        }}
      >
        Добавить новое дерево{" "}
      </Title>
      <FormCust onFinish={handleSubmit} />
    </div>
  );
};

export default TreeCreatePage;
