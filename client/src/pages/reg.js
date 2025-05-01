import React, { useState } from "react";
import { Button, Card, Container, Form, Row } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../store/authSlice";

function Reg() {
  //   const [username, setUsername] = useState("");
  //   const [surname, setSurname] = useState("");
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);

  const click = async (event) => {
    setValidated(true);
  };

  const [formData, setFormData] = useState({
    surname: "",
    name: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup(formData));
  };

  return (
    <>
      <Form
        className="d-flex flex-column"
        noValidate
        validated={validated}
        onSubmit={click}
      >
        <Form.Group md="4" controlId="validationCustom01">
          <Form.Control
            required
            className="mt-3"
            placeholder="Ваше имя"
            //   value={username}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group md="4" controlId="validationCustom02">
          <Form.Control
            required
            className="mt-3"
            placeholder="Ваша фамилия"
            //   value={surname}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group md="4" controlId="validationCustom03">
          <Form.Control
            required
            className="mt-3"
            placeholder="Ваш адрес электронной почты"
            //   value={email}
            onChange={handleChange}
          />{" "}
        </Form.Group>
        <Form.Group md="4" controlId="validationCustom04">
          <Form.Control
            required
            className="mt-3"
            placeholder="Придумайте пароль"
            //   value={password}
            onChange={handleChange}
            type="password"
          />{" "}
        </Form.Group>

        <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
          <Button className="mt-3" variant="light" onClick={handleSubmit}>
            Отправить
          </Button>
        </Row>
      </Form>
    </>
  );
}

export default Reg;
