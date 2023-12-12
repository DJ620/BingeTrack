import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector, useDispatch } from "react-redux";
import { addLibrary } from "../store/slices/showLibrary";
import api from "../utils/api";
import token from "../utils/token";

const Episode = ({ episode, showInfo, showMongoId }) => {
  const showLibrary = useSelector((state) => state.showLibrary);
  const dispatch = useDispatch();
  const [watched, setWatched] = useState(false);
  const [showInLibrary, setShowInLibrary] = useState(false);
  const [watchedEpisodes, setWatchedEpisodes] = useState([]);
  const [episodeMongoId, setEpisodeMongoId] = useState(null);
  const [hasAired, setHasAired] = useState(false);
  const [image, setImage] = useState("");

  useEffect(() => {
    if (showLibrary) {
      const isInLibrary = showLibrary.some((show) => {
        return show.showId === showInfo.id;
      });
      setShowInLibrary(isInLibrary);
      setWatchedEpisodes(
        showLibrary.filter((show) => show.showId === showInfo.id)[0]
          ?.watchedEpisodes
      );
      const epTime = episode.airdate + "T" + episode.airtime;
    const now = new Date().toISOString();
    setHasAired(now > epTime);
    };
    if (episode.image?.medium) {
      setImage(episode.image.medium)
    } else {
      setImage('https://diwanegypt.com/wp-content/uploads/2020/12/Placeholder-1.png');
    }
  }, [showLibrary]);

  useEffect(() => {
    if (watchedEpisodes && watchedEpisodes.length > 0) {
      const isWatched = watchedEpisodes.some((showEpisode) => {
        return showEpisode.episodeId === episode.id;
      });
      setWatched(isWatched);
      if (isWatched) {
        let mongoEpisode;
        mongoEpisode = watchedEpisodes.filter((ep) => {
          return ep.episodeId === episode.id;
        });
        setEpisodeMongoId(mongoEpisode[0]._id);
      }
    } else {
      setWatched(false);
    }
  }, [watchedEpisodes]);

  useEffect(() => {
    console.log(episode?.image?.medium)
  }, []);

  const handleWatchEpisode = () => {
    setWatched(!watched);
    let newEpisodeList = [];
    if (!watched) {
      const episodeData = {
        episodeId: episode.id,
        season: episode.season,
        number: episode.number,
        name: episode.name,
      };
      api
        .addEpisode({
          episodeData,
          showId: showMongoId,
          userId: token.getId(),
        })
        .then((res) => {
          dispatch(addLibrary(res.data.showLibrary));
        });
    } else {
      api.deleteEpisode(episodeMongoId, token.getId()).then((res) => {
        dispatch(addLibrary(res.data.showLibrary));
      });
    }
    setWatchedEpisodes(newEpisodeList);
  };

  return (
    <Card className={watched ? "bg-dark-subtle" : ""}>
      <Card.Header className="h6">
        Season {episode.season}, Episode {episode.number}
      </Card.Header>
      <Card.Img variant="top" src={image} />
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
              className={`mt-1 ${!hasAired ? 'disabled' : showInLibrary ? "" : "disabled"}`}
              variant={!hasAired ? 'dark' : watched ? "outline-secondary" : "dark"}
              size="sm"
              onClick={() => handleWatchEpisode()}
            >
              {!hasAired ? "Upcoming" : watched ? "Mark as Unwatched" : "Mark as Watched"}
            </Button>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default Episode;
