import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";
import token from "../utils/token";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useDispatch } from "react-redux";
import { addLibrary } from "../store/slices/showLibrary";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(token.getUsername());
      api
        .getShowLibrary(token.getId())
        .then((res) => {
          dispatch(addLibrary(res.data.showLibrary));
        });
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <Navbar expand="sm" className="bg-body-tertiary" fixed="top" collapseOnSelect>
      <Container>
        <LinkContainer to="/library">
          <Navbar.Brand>TV Tracker</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className={username ? '' : 'justify-content-end'}>
          {username ? (
            <Nav className="me-auto">
            <LinkContainer to="/library">
              <Nav.Link>Library</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/search">
              <Nav.Link>Search</Nav.Link>
            </LinkContainer>
            <Nav.Link onClick={() => handleLogout()}>Logout</Nav.Link>
          </Nav>
          ) : null}
          {username ? (
            <Navbar.Text>Welcome, {username}</Navbar.Text>
          ) : (
            <Navbar.Text>
              <LinkContainer to="/">
              <Nav.Link>Login</Nav.Link>
              </LinkContainer>
              </Navbar.Text>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
