import React from "react";
import Image from "react-bootstrap/Image";
// import background from "../img/forest.jpg";
import { Button, Container, Stack } from "react-bootstrap";
import "./CSS/main.css";

function Main() {
  return (
    <Stack className="position-relative d-flex justify-content-center">
      {/* <Image src={} fluid /> */}
      <Container
        style={{ position: "absolute" }}
        className="d-flex justify-content-center"
      >
        <div class="d-flex flex-column justify-content-center gap-3">
          <p class="d-flex hellotext h2">
            Добро пожаловать на сайт Зелёной карты Владимира
          </p>
          <Button href="/map" variant="outline-warning" className="button">
            Карта
          </Button>
        </div>
      </Container>
    </Stack>
  );
}
export default Main;
