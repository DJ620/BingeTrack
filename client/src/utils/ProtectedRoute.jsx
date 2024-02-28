import { useState, useEffect } from 'react';
import api from './api';
import token from './token';
import { useNavigate } from 'react-router-dom';
import { Spinner } from "react-bootstrap";

const ProtectedRoute = ({Component}) => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
    const [verified, setVerified] = useState(null);

    useEffect(() => {
        handleVerify();
    }, []);

    const handleVerify = async() => {
      await api.verify(token.getToken()).then(res => {
        if (res.data.success) {
            setVerified(true);
        } else {
            setVerified(false);
            navigate("/");
        };
    });
    setReady(true);
    };

    if (!ready) {
        return (
        <div className="row d-flex justify-content-center pt-5">
        <Spinner animation="border"/>
        </div>
        )
    }

    return verified ? (
        <Component />
    ) : (
        null
    );
}

export default ProtectedRoute;