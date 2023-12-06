import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/Search";
import Home from "./pages/Home";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import ShowInfo from "./pages/ShowInfo";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/show/:showId" element={<ShowInfo />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
