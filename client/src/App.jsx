import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/Search";
import Home from "./pages/Home";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import ShowInfo from "./pages/ShowInfo";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/library" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/show/:showId" element={<ShowInfo />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
