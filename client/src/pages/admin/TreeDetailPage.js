import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchTreeById } from "../../store/trees/treeThunks";
import {
  Card,
  Button,
  Spin,
  Descriptions,
  Image,
  Empty,
  Carousel,
  Layout,
  Tooltip,
} from "antd";
import { SmileOutlined } from "@ant-design/icons";
import DeleteTreeButton from "../../components/DeleteTreeButton";

const TreeDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: tree, loading } = useSelector((state) => state.trees);

  useEffect(() => {
    dispatch(fetchTreeById(id));
    console.log(tree);

    console.log(tree);
  }, [dispatch, id]);

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
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f8f8ee" }}>
      <div
        style={{
          maxWidth: "900px",
          margin: "50px auto",
          padding: "0 20px",
          background: "#f9f9f9",
        }}
      >
        <Card
          title={"Дерево"}
          extra={
            <Button
              type="primary"
              style={{
                backgroundColor: "#D5573B",
                color: "F7F4EF",
                fontFamily: "Poiret One",
              }}
            >
              <Link to={`/tree/${tree.id}/edit`}>Редактировать</Link>
            </Button>
          }
          style={{
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Тип">{tree.type}</Descriptions.Item>
            <Descriptions.Item label="Адрес">{tree.adress}</Descriptions.Item>
            {/* <Descriptions.Item label="Координаты широты">
            {tree.latitude}
          </Descriptions.Item>
          <Descriptions.Item label="Координаты долготы">
            {tree.longitude}
          </Descriptions.Item> */}
            <Descriptions.Item label="Координаты">
              <a
                href={`/map?lat=${tree.latitude}&lng=${tree.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tree.latitude}, {tree.longitude}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="Собственник">
              {tree.owner}
            </Descriptions.Item>
            <Descriptions.Item label="Высота">
              {tree.height} м
            </Descriptions.Item>
            <Descriptions.Item label="Диаметр ствола">
              {tree.diameter} м
            </Descriptions.Item>
            <Descriptions.Item label="Количество стволов">
              {tree.number_of_barrels} шт
            </Descriptions.Item>
            <Descriptions.Item label="Диаметр кроны">
              {tree.crown_diameter} м
            </Descriptions.Item>
            <Descriptions.Item label="Год посадки">
              {tree.year_of_planting}
            </Descriptions.Item>
            <Descriptions.Item label="Статус">
              {tree.status?.status_name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Особые пометки">
              {tree.special_note?.note || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Среда произрастания">
              {tree.environment?.name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Состояние">
              {tree.condition?.name || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Пользователь, добавивший ">
              {tree.user?.name || "-"}
            </Descriptions.Item>

            {Array.isArray(tree.photos) && tree.photos.length > 0 ? (
              <Descriptions.Item label="Фото">
                <Image.PreviewGroup>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {tree.photos.map((photo, index) => (
                      <Image
                        key={index}
                        width={150}
                        src={`http://localhost:8080/static/photo/${photo.name}`}
                        alt={`Фото ${index + 1}`}
                        style={{ borderRadius: 4, objectFit: "cover" }}
                      />
                    ))}
                  </div>
                </Image.PreviewGroup>
              </Descriptions.Item>
            ) : (
              <Empty
                description="Нет фото"
                image={<SmileOutlined />}
                style={{ fontSize: 28, color: "#aaa" }}
              />
            )}

            {Array.isArray(tree.documents) && tree.documents.length > 0 ? (
              <Descriptions.Item label="Файлы">
                <ul style={{ paddingLeft: "20px" }}>
                  {tree.documents.map((doc, index) => (
                    <li key={index} style={{ marginBottom: "8px" }}>
                      <a
                        href={`http://localhost:8080/static/documents/${doc.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {doc.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </Descriptions.Item>
            ) : (
              <Empty
                description="Нет файлов"
                image={<SmileOutlined />}
                style={{ fontSize: 28, color: "#aaa" }}
              />
            )}

            <Descriptions.Item label="Последние изменения">
              {new Date(tree.updatedAt).toLocaleDateString()}
            </Descriptions.Item>
          </Descriptions>
        </Card>
        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
        >
          <DeleteTreeButton />
        </div>
      </div>
    </Layout>
  );
};

export default TreeDetailPage;
