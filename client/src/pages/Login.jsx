import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Spinner } from "react-bootstrap";
import api from "../utils/api";
import token from "../utils/token";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    handleVerify();
  }, []);

  const handleVerify = async() => {
    await api.verify(token.getToken()).then(res => {
      if (res.data.success) {
        navigate("/library");
      } else {
        localStorage.removeItem("token");
      };
    });
  };

  const signIn = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    api.login({ username, password }).then((res) => {
      if (res.data.success) {
        localStorage.setItem("token", JSON.stringify(res.data.token));
        navigate("/library");
      } else {
        setLoading(false);
        setError(res.data.message);
      }
    });
  };

  const styles = {
    form: {
      width: "200px",
      margin: "0 auto",
    },
  };

  return (
    <div className="container pt-3">
      <h2 className="text-center mt-2">Sign In</h2>
      <Form style={styles.form} className="mt-3" onSubmit={signIn}>
        <Form.Group className="row d-flex justify-content-center align-items-center mb-3">
          <Form.Label>Username: </Form.Label>
          <Form.Control
            type="text"
            className="text-center shadow"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="row d-flex justify-content-center align-items-center ">
          <Form.Label>Password: </Form.Label>
          <Form.Control
            type="password"
            className="text-center shadow"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="row d-flex justify-content-center mt-4">
          <button className="btn btn-lg btn-dark" onClick={signIn}>
            Login
          </button>
        </div>
      </Form>
      {loading ? (
        <div className="row d-flex justify-content-center pt-3">
          <Spinner animation="border" />
        </div>
      ) : (
        <p className="text-center mt-2">
          Don't have an account? Register <a href="/register">here</a>
        </p>
      )}
      {error ? (
        <p className="text-center" style={{ color: "red" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default Login;
