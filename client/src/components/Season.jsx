import { useState, useEffect } from "react";
import Episode from "./Episode";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import api from "../utils/api";
import token from "../utils/token";
import { addLibrary } from "../store/slices/showLibrary";

const Season = ({ season, seasonNumber, showInfo }) => {
  const dispatch = useDispatch();
  const showLibrary = useSelector(state => state.showLibrary);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [numWatched, setNumWatched] = useState(0);
  const [mongoAiredEpIds, setMongoAiredEpIds] = useState([]);
  const [hasUnwatched, setHasUnwatched] = useState(false);
  const [showMongoId, setShowMongoId] = useState(null);

  useEffect(() => {
    setShowMongoId(showLibrary.find(({ showId }) => showId === showInfo.id)?._id);
    setTotalEpisodes(season.length);
    let epsWatched = showLibrary.filter((show) => show.showId === showInfo.id)[0]?.episodes.filter(ep => ep.watched && ep.season == seasonNumber).length;
    if (!epsWatched) epsWatched = 0;
    setNumWatched(epsWatched);
    setMongoAiredEpIds(showLibrary.filter(show => show.showId == showInfo.id)[0]?.episodes.filter(ep => ep.season == seasonNumber && new Date().toISOString() > ep.airTime).map(ep => ep._id));
  }, [showLibrary]);

  useEffect(() => {
    setHasUnwatched(numWatched < mongoAiredEpIds?.length);
  }, [numWatched, mongoAiredEpIds]);

  const handleWatchSeason = () => {
    const seasonData = ({
      episodeIds: mongoAiredEpIds,
      userId: token.getId()
    });
    if (hasUnwatched) {
      api
        .watchSeason(seasonData)
        .then(res => {
          dispatch(addLibrary(res.data.showLibrary));
        });
    } else {
      api
        .unwatchSeason(seasonData)
        .then(res => {
          dispatch(addLibrary(res.data.showLibrary));
        });
    };
  };

  const styles = {
    seasonBtn: {
      display: showMongoId ? "block" : "none"
    }
  };

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
         <div>
         <Button variant={hasUnwatched ? "outline-dark" : "dark"} size="sm" className="mb-3" onClick={() => handleWatchSeason()} style={styles.seasonBtn}>
           {hasUnwatched ? "Mark whole season as watched" : "Mark whole season as unwatched"}
         </Button>
        <Row xs={1} md={2} className="g-4">
          {season.map((episode) => {
            return (
              <Col key={episode.id}>
                <Episode episode={episode} showInfo={showInfo} showMongoId={showMongoId}/>
              </Col>
            );
          })}
        </Row>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Season;
