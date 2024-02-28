import React from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router";

function LibrarySection({ allShows, show, setShow }) {
  const navigate = useNavigate();
  return (
    <>
    {allShows.length > 0 && show && (
    <Row className="justify-content-center bg-body-secondary pt-3">
      {allShows.map((show) => {
        return (
          <Col
            key={show.showId}
            className="col-lg-3 col-12 col-sm-6 col-md-4 my-2 text-center"
          >
            <img
              src={show.image}
              style={{ maxHeight: "200px", cursor: "pointer" }}
              onClick={() => navigate(`/show/${show.showId}`)}
            />
            {/* <h4>{show.name}</h4> */}
          </Col>
        );
      })}
    </Row>)}
    </>
  );
}

export default LibrarySection;
