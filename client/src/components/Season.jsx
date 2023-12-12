import { useState, useEffect } from "react";
import Episode from "./Episode";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useSelector } from 'react-redux';

const Season = ({ season, seasonNumber, showInfo, showMongoId }) => {
  const showLibrary = useSelector(state => state.showLibrary);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [numWatched, setNumWatched] = useState(0);

  useEffect(() => {
    setTotalEpisodes(season.length);
    let allEps = showLibrary.filter(ep => {
      return ep.showId === showInfo.id;
    })[0]?.watchedEpisodes.filter(ep => {
      return ep.season == seasonNumber;})
    setNumWatched(allEps ? allEps.length : 0);
  }, [showLibrary]);

  return (
    <div>
      <Button
        style={{width: '200px'}}
        className="mb-4 mt-4"
        onClick={() => setShowEpisodes(!showEpisodes)}
        variant={showEpisodes ? (numWatched === totalEpisodes ? "outline-success" : "outline-primary") : (numWatched === totalEpisodes ? "success" : "primary")}
      >
        Season {seasonNumber} ({numWatched} / {totalEpisodes})
        {showEpisodes ? <FaCaretUp className="ms-3" /> : <FaCaretDown className="ms-3" />}
      </Button>
      {showEpisodes ? (
        <Row xs={1} md={2} className="g-4">
          {season.map((episode) => {
            return (
              <Col key={episode.id}>
                <Episode episode={episode} showInfo={showInfo} showMongoId={showMongoId}/>
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
