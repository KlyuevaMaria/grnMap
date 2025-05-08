import { Button, Modal, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { deleteTree } from "../store/trees/treeAdminThunks";
import { useDispatch } from "react-redux";

const DeleteTreeButton = () => {
  const { id } = useParams(); // получаем ID дерева из URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async (treeId) => {
    try {
      await dispatch(deleteTree(id)).unwrap();
      message.success(`Дерево #${treeId} удалено` || "Дерево удалено");
      navigate("/admin/trees"); // редирект на список деревьев после удаления
    } catch (error) {
      message.error("Ошибка при удалении");
    }
  };

  const showDeleteConfirm = () => {
    Modal.confirm({
      title: `Вы уверены, что хотите удалить дерево #${id}?`,
      icon: <ExclamationCircleOutlined />,
      content: "Это действие необратимо.",
      okText: "Да, удалить",
      okType: "danger",
      cancelText: "Отмена",
      onOk: () => handleDelete(id),
    });
  };

  return (
    <Button danger onClick={showDeleteConfirm}>
      Удалить дерево
    </Button>
  );
};

export default DeleteTreeButton;
