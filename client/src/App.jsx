import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Header from "./components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import ShowInfo from "./pages/ShowInfo";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div style={{paddingBottom: '70px', paddingTop: '70px'}}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/library" element={<ProtectedRoute Component={Library} />} />
          <Route path="/search" element={<ProtectedRoute Component={Search} />} />
          <Route path="/show/:showId" element={<ProtectedRoute Component={ShowInfo} />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
