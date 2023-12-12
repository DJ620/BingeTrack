import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

const Library = () => {
  const navigate = useNavigate();
  const showLibrary = useSelector((state) => state.showLibrary);

  return (
    <Container>
        <h1>Library</h1>
        <Row>
          {showLibrary.length > 0 ? (
            showLibrary.map((show) => {
             return  <Col key={show.id} className="col-lg-3 col-12 col-sm-6 col-md-4 mb-3">
                <img src={show.image} style={{ maxHeight: '300px', cursor: 'pointer'}} onClick={() => navigate(`/show/${show.showId}`)}/>
                <h4>{show.name}</h4>
              </Col>
            })
          ) : (
            <p>You don't currently have any shows in your Library</p>
          )}
        </Row>
        </Container>
  )
}

export default Library;