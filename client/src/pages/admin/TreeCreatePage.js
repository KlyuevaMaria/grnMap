import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { createTree } from "../../store/trees/treeThunks"; // Предположим, у тебя есть createTree
import TreeForm from "../../components/TreeForm";
import FormCust from "../../components/FormCust";

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
      <h2 style={{ marginBottom: 24 }}>Добавить новое дерево</h2>
      <FormCust onFinish={handleSubmit} />
    </div>
  );
};

export default TreeCreatePage;
