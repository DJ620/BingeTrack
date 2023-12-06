import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Season from "../components/Season";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/esm/Button";
import { useDispatch, useSelector } from "react-redux";
import { addShow, deleteShow } from "../store/slices/showLibrary";

const ShowInfo = () => {
  const dispatch = useDispatch();
  const showLibrary = useSelector((state) => state.showLibrary);
  const { showId } = useParams();
  const [showInfo, setShowInfo] = useState({});
  const [showSeasons, setShowSeasons] = useState([]);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inLibrary, setInLibrary] = useState(false);

  useEffect(() => {
    getShowInfo();
  }, []);

  useEffect(() => {
    const isInLibrary = showLibrary.some((show) => {
      return show.id === showInfo.id;
    });
    setInLibrary(isInLibrary);
  }, [showLibrary, showInfo]);

  const getShowInfo = async () => {
    setLoading(true);
    try {
      const options = {
        method: "GET",
        url: `https://api.tvmaze.com/shows/${showId}?embed=episodes`,
      };
      const response = await axios.request(options);
      console.log(response.data);
      setShowInfo(response.data);
      const seasons = Object.groupBy(
        response.data._embedded.episodes,
        ({ season }) => season
      );
      console.log(seasons);
      setShowSeasons(seasons);
      setShowEpisodes(!showEpisodes);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowLibrary = () => {
    setInLibrary(!inLibrary);
    if (!inLibrary) {
      dispatch(
        addShow({
          id: showInfo.id,
          name: showInfo.name,
          image: showInfo?.image?.original
        })
      );
    } else {
      dispatch(deleteShow(showInfo.id));
    }
  };

  return (
    <Container>
      {loading ? (
        <Spinner animation="border" role="status" />
      ) : (
        <>
          <Row>
            <Col>
              <h1>{showInfo.name}</h1>
            </Col>
            <Col>
              <Button
                className="float-end mt-2"
                variant={inLibrary ? "danger" : "success"}
                onClick={() => handleShowLibrary()}
              >
                {inLibrary ? "Remove from Library" : "Add to Library"}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xl={4} xs={12} lg={5}>
              <img
                src={showInfo?.image?.original}
                style={{ maxHeight: "475px" }}
              />
            </Col>
            <Col className="align-self-center">
              <Card className="mt-3 mt-lg-0 bg-light-subtle">
                <Card.Body>
                  <p
                    style={{ fontSize: "18px" }}
                    dangerouslySetInnerHTML={{ __html: showInfo.summary }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div>
            {Object.keys(showSeasons).map((season, index) => {
              return (
                <div key={index}>
                  <Season
                    season={showSeasons[season]}
                    seasonNumber={season}
                    showInfo={showInfo}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </Container>
  );
};

export default ShowInfo;
