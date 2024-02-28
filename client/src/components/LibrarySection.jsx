import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

function LibrarySection({ sectionTitle, allShows }) {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  return (
    <>
      {allShows.length > 0 && (
        <h4 className="text-center mt-4">
          {sectionTitle} ({allShows.length}){" "}
          {show ? (
            <FaCaretUp
              className="ms-3"
              style={{ cursor: "pointer" }}
              onClick={() => setShow(false)}
            />
          ) : (
            <FaCaretDown
              className="ms-3"
              style={{ cursor: "pointer" }}
              onClick={() => setShow(true)}
            />
          )}
        </h4>
      )}
      {allShows.length > 0 && show && (
        <Row className="justify-content-center bg-body-secondary py-3">
          {allShows.map((show) => {
            return (
              <Col
                key={show.showId}
                className="col-lg-2 col-12 col-sm-6 col-md-4 my-2 text-center d-flex justify-content-center"
              >
                <div style={{height: "200px", width: "134px", backgroundColor:"gray"}}>
                <img
                  src={show.image}
                  style={{ height: "200px", width: "134px", cursor: "pointer" }}
                  onClick={() => navigate(`/show/${show.showId}`)}
                />
                </div>
                {/* <h4>{show.name}</h4> */}
              </Col>
            );
          })}
        </Row>
      )}
      {!show && <hr />}
    </>
  );
}

export default LibrarySection;
