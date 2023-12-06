import { useState, useEffect } from "react";
import Episode from "./Episode";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const Season = ({ season, seasonNumber, showInfo }) => {
  const [showEpisodes, setShowEpisodes] = useState(false);

  return (
    <div>
      <Button
        className="mb-4 mt-4"
        onClick={() => setShowEpisodes(!showEpisodes)}
        variant={showEpisodes ? "outline-primary" : "primary"}
      >
        Season {seasonNumber} Episodes{" "}
        {showEpisodes ? <FaCaretUp /> : <FaCaretDown />}{" "}
      </Button>
      {showEpisodes ? (
        <Row xs={1} md={2} className="g-4">
          {season.map((episode) => {
            return (
              <Col key={episode.id}>
                <Episode episode={episode} showInfo={showInfo} />
              </Col>
            );
          })}
        </Row>
      ) : (
        ""
      )}
    </div>
  );
};

export default Season;
