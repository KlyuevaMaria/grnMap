import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Router } from "react-router-dom";
import AppRoutes from "./routes/routes";
import Navbar from "./components/Navbar";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
