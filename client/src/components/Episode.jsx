import { useState, useEffect, Suspense } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector, useDispatch } from "react-redux";
import { addLibrary } from "../store/slices/showLibrary";
import api from "../utils/api";
import token from "../utils/token";
import EpisodeModal from "./EpisodeModal";

const Episode = ({ episode, showInfo }) => {
  const showLibrary = useSelector((state) => state.showLibrary);
  const dispatch = useDispatch();
  const [watched, setWatched] = useState(false);
  const [showInLibrary, setShowInLibrary] = useState(false);
  const [watchedEpisodes, setWatchedEpisodes] = useState([]);
  const [episodeMongoId, setEpisodeMongoId] = useState(null);
  const [hasAired, setHasAired] = useState(false);
  const [image, setImage] = useState("");
  const [episodeAirdate, setEpisodeAirdate] = useState(null);
  const [previousEpisodeIds, setPreviousEpisodeIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previousUnseen, setPreviousUnseen] = useState(false);

  useEffect(() => {
    if (showLibrary) {
      const isInLibrary = showLibrary.some((show) => {
        return show.showId === showInfo.id;
      });
      setShowInLibrary(isInLibrary);
      setWatchedEpisodes(
        showLibrary
          .filter((show) => show.showId === showInfo.id)[0]
          ?.episodes.filter((ep) => ep.watched)
      );
      let epAirTime = episode.airtime;
      if (epAirTime == "" || epAirTime == null) {
        epAirTime = "00:00";
      }
      const epTime = episode.airdate + "T" + episode.airtime;
      const now = new Date().toISOString();
      setHasAired(now > epTime);
      setEpisodeAirdate(epTime);
    }
    if (episode.image?.original) {
      setImage(episode.image.original);
    } else {
      setImage(
        "https://diwanegypt.com/wp-content/uploads/2020/12/Placeholder-1.png"
      );
    }
    let previousSeason = showLibrary
      .filter((show) => show.showId == showInfo.id)[0]
      ?.episodes.filter((ep) => ep.season < episode.season);
    let previousEps = showLibrary
      .filter((show) => show.showId == showInfo.id)[0]
      ?.episodes.filter(
        (ep) => ep.season == episode.season && ep.number <= episode.number
      );
    let allPrevious;
    if (previousEps) {
      allPrevious = [...previousEps, ...previousSeason];
      setPreviousEpisodeIds(
        allPrevious.filter((ep) => !ep.watched).map((ep) => ep._id)
      );
    }
  }, [showLibrary]);

  useEffect(() => {
    setPreviousUnseen(previousEpisodeIds.length > 1);
  }, [previousEpisodeIds]);

  useEffect(() => {
    if (watchedEpisodes && watchedEpisodes.length > 0) {
      const isWatched = watchedEpisodes.some((showEpisode) => {
        return showEpisode.episodeId === episode.id;
      });
      setWatched(isWatched);
    } else {
      setWatched(false);
    }
  }, [watchedEpisodes]);

  useEffect(() => {
    if (showInLibrary) {
      let mongoEpisode = showLibrary
        .filter((show) => show.showId === showInfo.id)[0]
        .episodes.filter((ep) => ep.episodeId === episode.id)[0]?._id;
      setEpisodeMongoId(mongoEpisode);
    }
  }, [showInLibrary]);

  const handleWatchEpisode = () => {
    setWatched(!watched);
    let newEpisodeList = [];
    const episodeData = {
      episodeId: episodeMongoId,
      userId: token.getId(),
    };
    if (!watched) {
      api.watchEpisode(episodeData).then((res) => {
        dispatch(addLibrary(res.data.showLibrary));
      });
    } else {
      api.unwatchEpisode(episodeData).then((res) => {
        dispatch(addLibrary(res.data.showLibrary));
      });
    }
    setWatchedEpisodes(newEpisodeList);
  };

  const openModal = () => {
    if (!watched && previousUnseen) {
      setShowModal(true);
    } else {
      handleWatchEpisode();
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <Card className={watched ? "bg-dark-subtle" : ""}>
      <EpisodeModal
        showModal={showModal}
        closeModal={closeModal}
        episodeIds={previousEpisodeIds}
        handleWatchEpisode={handleWatchEpisode}
      />
      <Card.Header className="h6">
        Season {episode.season}, Episode {episode.number}
      </Card.Header>
      <Suspense fallback={<p>Loading...</p>}>
        <Card.Img variant="top" src={image} />
      </Suspense>
      <Card.Body>
        <Card.Title className="h4">{episode.name}</Card.Title>
        <Card.Text style={{ height: "100px", overflow: "scroll" }}>
          <p dangerouslySetInnerHTML={{ __html: episode.summary }} />
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <Row>
          <Col xs={6} className="pe-0">
            <p style={{ fontSize: "14px" }} className="pt-2">
              Air Date: {new Date(episode.airdate).toLocaleDateString()}
            </p>
          </Col>
          <Col className="ps-0">
            <Button
              className={`mt-1 ${
                !hasAired ? "disabled" : showInLibrary ? "" : "disabled"
              }`}
              variant={
                !hasAired ? "dark" : watched ? "outline-secondary" : "dark"
              }
              size="sm"
              onClick={() => openModal()}
            >
              {!hasAired
                ? "Upcoming"
                : watched
                ? "Mark as Unwatched"
                : "Mark as Watched"}
            </Button>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default Episode;
