import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import axios from "axios";
import api from "../utils/api";
import token from "../utils/token";
import { addLibrary } from "../store/slices/showLibrary";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const Library = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showLibrary = useSelector((state) => state.showLibrary);
  const [upToDate, setUpToDate] = useState([]);
  const [hasNewEpisodes, setHasNewEpisodes] = useState([]);
  const [notStarted, setNotStarted] = useState([]);
  const [needsUpdating, setNeedsUpdating] = useState([]);
  const [showWatchNext, setShowWatchNext] = useState(true);
  const [showNotStarted, setShowNotStarted] = useState(true);
  const [showUpToDate, setShowUpToDate] = useState(true);

  useEffect(() => {
    setUpToDate(
      showLibrary.filter(
        (show) =>
          show.episodes.filter(
            (ep) => !ep.watched && new Date().toISOString() > ep.airTime
          ).length == 0
      )
    );
    setNotStarted(
      showLibrary.filter(
        (show) => show.episodes.filter((ep) => ep.watched).length == 0
      )
    );
    setHasNewEpisodes(
      showLibrary.filter(
        (show) =>
          show.episodes.filter(
            (ep) => !ep.watched && new Date().toISOString() > ep.airTime
          ).length > 0 && show.episodes.filter((ep) => ep.watched).length > 0
      )
    );
  }, [showLibrary]);

  useEffect(() => {
    if (upToDate.length > 0) {
      getUpdates();
    }
  }, [upToDate]);

  useEffect(() => {
    if (needsUpdating.length > 0) {
      needsUpdating.forEach((show) => {
        getShowInfo(show);
      });
    }
  }, [needsUpdating]);

  const getUpdates = async () => {
    try {
      const options = {
        method: "GET",
        url: "https://api.tvmaze.com/updates/shows",
      };
      const response = await axios.request(options);
      let showUpdates = [];
      upToDate.forEach((show) => {
        if (response.data[show.showId] !== show.updated) {
          showUpdates.push(show);
        }
      });
      setNeedsUpdating(showUpdates);
    } catch (error) {
      console.log(error);
    }
  };

  const getShowInfo = async (show) => {
    try {
      const options = {
        method: "GET",
        url: `https://api.tvmaze.com/shows/${show.showId}?embed=episodes`,
      };
      const response = await axios.request(options);
      const existing = show.episodes;
      const episodesData = response.data._embedded.episodes.map((ep) => {
        let epTime = ep.airtime;
        if (ep.airtime == "" || ep.airtime == null) {
          epTime = "00:00";
        }
        return {
          episodeId: ep.id,
          season: ep.season,
          number: ep.number,
          name: ep.name,
          airTime: `${ep.airdate}T${epTime}`,
          watched: false
        };
      });
      const newEps = episodesData.filter(
        (ep) =>
          !existing.some((existingEp) => existingEp.episodeId === ep.episodeId)
      );
      if (newEps.length > 0) {
        api
          .addNewEpisodes({
            episodesData: newEps,
            showId: show._id,
            userId: token.getId()
          })
          .then(res => {
            dispatch(addLibrary(res.data.showLibrary));
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <h1>Library</h1>
      {showLibrary.length == 0 ? (
        <p>You don't currently have any shows in your library</p>
      ) : null}
      {hasNewEpisodes.length > 0 ? (
        <h4 className="text-center mt-4">Watch Next ({hasNewEpisodes.length}) {showWatchNext ? <FaCaretUp className="ms-3" style={{cursor: 'pointer'}} onClick={() => setShowWatchNext(false)}/> :<FaCaretDown className="ms-3" style={{cursor: 'pointer'}} onClick={() => setShowWatchNext(true)}/>}</h4>
      ) : null}
      {hasNewEpisodes.length > 0 && showWatchNext ? (
        <Row className="justify-content-center bg-body-secondary pt-3">
          {hasNewEpisodes.map((show) => {
            return (
              <Col
                key={show.showId}
                className="col-lg-3 col-12 col-sm-6 col-md-4 mt-2 text-center"
              >
                <img
                  src={show.image}
                  style={{ maxHeight: "200px", cursor: "pointer" }}
                  onClick={() => navigate(`/show/${show.showId}`)}
                />
                <h4>{show.name}</h4>
              </Col>
            );
          })}
        </Row>
      ) : null}
      {notStarted.length > 0 ? (
        <h4 className="text-center mt-4">Haven't Started Watching ({notStarted.length}) {showNotStarted ? <FaCaretUp className="ms-3" style={{cursor: 'pointer'}} onClick={() => setShowNotStarted(false)}/> :<FaCaretDown className="ms-3" style={{cursor: 'pointer'}} onClick={() => setShowNotStarted(true)}/>}</h4>
      ) : null}
      {notStarted.length > 0 && showNotStarted ? (
        <Row className="justify-content-center bg-body-secondary pt-3">
          {notStarted.map((show) => {
            return (
              <Col
                key={show.showId}
                className="col-lg-3 col-12 col-sm-6 col-md-4 mt-2 text-center"
              >
                <img
                  src={show.image}
                  style={{ maxHeight: "200px", cursor: "pointer" }}
                  onClick={() => navigate(`/show/${show.showId}`)}
                />
                <h4>{show.name}</h4>
              </Col>
            );
          })}
        </Row>
      ) : null}
      {upToDate.length > 0 ? (
        <h4 className="text-center mt-4">Up To Date ({upToDate.length}) {showUpToDate ? <FaCaretUp className="ms-3" style={{cursor: 'pointer'}} onClick={() => setShowUpToDate(false)}/> :<FaCaretDown className="ms-3" style={{cursor: 'pointer'}} onClick={() => setShowUpToDate(true)}/>}</h4>
      ) : null}
      {upToDate.length > 0 && showUpToDate ? (
        <Row className="justify-content-center bg-body-secondary pt-3">
          {upToDate.map((show) => {
            return (
              <Col
                key={show.showId}
                className="col-lg-3 col-12 col-sm-6 col-md-4 mt-2 text-center"
              >
                <img
                  src={show.image}
                  style={{ maxHeight: "200px", cursor: "pointer" }}
                  onClick={() => navigate(`/show/${show.showId}`)}
                />
                <h4>{show.name}</h4>
              </Col>
            );
          })}
        </Row>
      ) : null}
    </Container>
  );
};

export default Library;
