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
import SeasonModal from "./SeasonModal";

const Season = ({ season, seasonNumber, showInfo }) => {
  const dispatch = useDispatch();
  const showLibrary = useSelector(state => state.showLibrary);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [numWatched, setNumWatched] = useState(0);
  const [mongoAiredEpIds, setMongoAiredEpIds] = useState([]);
  const [mongoAiredEpIdsAndPrevious, setMongoAiredEpIdsAndPrevious] = useState([]);
  const [hasUnwatched, setHasUnwatched] = useState(false);
  const [previousSeasonHasUnwatched, setPreviousSeasonHasUnwatched] = useState(false);
  const [showMongoId, setShowMongoId] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    const previous = showLibrary.filter(show => show.showId == showInfo.id)[0]?.episodes.filter(ep => ep.season < seasonNumber).map(ep => ep._id);
    if (previous) setMongoAiredEpIdsAndPrevious([...previous, ...mongoAiredEpIds]);
  }, [numWatched, mongoAiredEpIds]);

  useEffect(() => {
    const previousSeasonEps = showLibrary.filter(show => show.showId == showInfo.id)[0]?.episodes.filter(ep => ep.season < seasonNumber && !ep.watched);
    if (previousSeasonEps) setPreviousSeasonHasUnwatched(previousSeasonEps.length > 0);
  }, [mongoAiredEpIdsAndPrevious]);

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

  const openModal = () => {
    if (hasUnwatched && seasonNumber > 1 && previousSeasonHasUnwatched) {
      setShowModal(true);
    } else {
      handleWatchSeason();
    };
  };

  const closeModal = () => setShowModal(false);

  const styles = {
    seasonBtn: {
      display: showMongoId && mongoAiredEpIds.length > 0 ? "block" : "none",
      cursor: "pointer",
      height: "40px"
    }
  };

  return (
    <div>
      <SeasonModal 
        showModal={showModal}
        closeModal={closeModal}
        episodeIds={mongoAiredEpIdsAndPrevious}
        handleWatchSeason={handleWatchSeason}  
      />
      <div style={{display: 'flex'}}>
      <Button
        style={{width: '200px'}}
        className="mb-4 mt-4"
        onClick={() => setShowEpisodes(!showEpisodes)}
        variant={showEpisodes ? (numWatched === totalEpisodes ? "outline-success" : "outline-primary") : (numWatched === totalEpisodes ? "success" : "primary")}
      >
        Season {seasonNumber} ({numWatched} / {totalEpisodes})
        {showEpisodes ? <FaCaretUp className="ms-3" /> : <FaCaretDown className="ms-3" />}
      </Button>
      <img src={hasUnwatched ? "https://cdn.icon-icons.com/icons2/3257/PNG/512/checkbox_circle_icon_206111.png" : "https://cdn.icon-icons.com/icons2/2248/PNG/512/checkbox_marked_circle_icon_137772.png"} onClick={openModal} style={styles.seasonBtn} className="mt-4 ms-2" />
      </div>
      {showEpisodes ? (
         <div>
        <Row xs={1} md={2} className="g-4">
          {season.map((episode) => {
            return (
              <Col key={episode.id}>
                <Episode episode={episode} showInfo={showInfo}/>
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
