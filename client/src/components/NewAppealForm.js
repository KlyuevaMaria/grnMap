import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAppeal } from "../store/appealSlice";
import { Button, Input, message, Spin } from "antd";
import { addUserAppeal } from "../store/userAppealsSlice";

const { TextArea } = Input;

const NewAppealForm = () => {
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();

  const { loading, error, successMessage } = useSelector(
    (state) => state.appeals
  );

  const handleSubmit = async () => {
    if (!description.trim()) {
      message.warning("Пожалуйста, введите описание обращения");
      return;
    }

    try {
      const result = await dispatch(createAppeal(description));
      if (createAppeal.fulfilled.match(result)) {
        message.success("Обращение отправлено!");
        setDescription("");
        dispatch(addUserAppeal(result.payload));
      } else {
        message.error(result.payload?.message || "Ошибка");
      }
    } catch (err) {
      console.error(err);
      message.error("Ошибка отправки");
    }
  };

  return (
    <div style={{ maxWidth: "500px", marginTop: "20px" }}>
      <h3 style={{ color: "#e06645", fontFamily: "'Bitter', serif" }}>
        Новое обращение
      </h3>
      <TextArea
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Пожалуйста, расскажите нам какую проблему Вы обнаружили"
        style={{ marginBottom: "10px", fontFamily: "'Bitter', serif" }}
      />
      <Button
        type="primary"
        loading={loading}
        onClick={handleSubmit}
        style={{
          backgroundColor: "#e06645",
          border: "none",
          fontFamily: "'Bitter', serif",
        }}
      >
        Отправить
      </Button>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default NewAppealForm;
