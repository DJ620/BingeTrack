import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector, useDispatch } from "react-redux";
import { handleEpisodes } from "../store/slices/showLibrary";

const Episode = ({ episode, showInfo }) => {
  const showLibrary = useSelector((state) => state.showLibrary);
  const dispatch = useDispatch();
  const [watched, setWatched] = useState(false);
  const [showInLibrary, setShowInLibrary] = useState(false);
  const [watchedEpisodes, setWatchedEpisodes] = useState([]);

  useEffect(() => {
    if (showLibrary) {
      const isInLibrary = showLibrary.some((show) => {
        return show.id === showInfo.id;
      });
      setShowInLibrary(isInLibrary);
      setWatchedEpisodes(showLibrary.filter((show) => show.id === showInfo.id)[0]?.watchedEpisodes);
    }
  }, [showLibrary]);

  useEffect(() => {
    if (watchedEpisodes && watchedEpisodes.length > 0) {
      const isWatched = watchedEpisodes.some((showEpisode) => {
        return showEpisode.id === episode.id;
      });
      setWatched(isWatched);
    } else {
      setWatched(false);
    };
  }, [watchedEpisodes]);

  const handleWatchEpisode = () => {
    setWatched(!watched);
    let newEpisodeList = [];
    if (!watched) {
      newEpisodeList = [...watchedEpisodes, { id: episode.id, season: episode.season, number: episode.number, name: episode.name }];
    } else {
      newEpisodeList = watchedEpisodes.filter((watchedEpisode) => {
        return watchedEpisode.id !== episode.id;
      })
      console.log(newEpisodeList)
    }
      dispatch(
        handleEpisodes({
          id: showInfo.id,
          name: showInfo.name,
          image: showInfo?.image?.original,
          watchedEpisodes: newEpisodeList
        })
      )
      setWatchedEpisodes(newEpisodeList);
  };

  return (
    <Card className={watched ? "bg-dark-subtle" : ""}>
      <Card.Header className="h6">
        Season {episode.season}, Episode {episode.number}
      </Card.Header>
      <Card.Img variant="top" src={episode?.image?.medium} />
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
              Air Date: {new Date(episode.airstamp).toLocaleDateString()}
            </p>
          </Col>
          <Col className="ps-0">
            <Button
              className={`mt-1 ${showInLibrary ? "" : "disabled"}`}
              variant={watched ? "outline-secondary" : "dark"}
              size="sm"
              onClick={() => handleWatchEpisode()}
            >
              {watched ? "Mark as Unwatched" : "Mark as Watched"}
            </Button>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default Episode;
