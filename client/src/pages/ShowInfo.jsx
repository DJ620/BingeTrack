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
import { addLibrary } from "../store/slices/showLibrary";
import api from "../utils/api";
import token from "../utils/token";

const ShowInfo = () => {
  const dispatch = useDispatch();
  const showLibrary = useSelector((state) => state.showLibrary);
  const { showId } = useParams();
  const [showInfo, setShowInfo] = useState({});
  const [showSeasons, setShowSeasons] = useState([]);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inLibrary, setInLibrary] = useState(false);
  const [mongoId, setMongoId] = useState(null);
  const [episodesData, setEpisodesData] = useState([]);
  const [mongoEpisodeIds, setMongoEpisodeIds] = useState([]);

  useEffect(() => {
    getShowInfo();
  }, []);

  useEffect(() => {
    const isInLibrary = showLibrary.some((show) => {
      return show.showId === showInfo.id;
    });
    setMongoId(showLibrary.find(({ showId }) => showId === showInfo.id)?._id);
    setMongoEpisodeIds(
      showLibrary
        .filter((show) => show.showId == showInfo.id)[0]
        ?.episodes.map((ep) => ep._id)
    );
    setInLibrary(isInLibrary);
  }, [showLibrary, showInfo]);

  useEffect(() => {
    if (mongoId) {
      const existing = showLibrary.filter(
        (show) => show.showId == showInfo.id
      )[0]?.episodes;
      if (existing) {
        const newEps = episodesData.filter(
          (ep) =>
            !existing.some(
              (existingEp) => existingEp.episodeId === ep.episodeId
            )
        );
        if (newEps.length > 0) {
          api
            .addNewEpisodes({
              episodesData: newEps,
              showId: mongoId,
              userId: token.getId(),
            })
            .then((res) => {
              dispatch(addLibrary(res.data.showLibrary));
            });
        }
      }
    }
  }, [mongoId]);

  useEffect(() => {
    if (inLibrary) {
      api
        .updateShow({
          showId: mongoId,
          updated: showInfo.updated,
          userId: token.getId()
        })
        .then(res => {
          dispatch(addLibrary(res.data.showLibrary));
        });
    };
  }, [inLibrary]);

  const getShowInfo = async () => {
    setLoading(true);
    try {
      const options = {
        method: "GET",
        url: `https://api.tvmaze.com/shows/${showId}?embed=episodes`,
      };
      const response = await axios.request(options);
      setShowInfo(response.data);
      const seasons = Object.groupBy(
        response.data._embedded.episodes,
        ({ season }) => season
      );
      setShowSeasons(seasons);
      setShowEpisodes(!showEpisodes);
      setLoading(false);
      const allEpisodes = response.data._embedded.episodes.map((ep) => {
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
          watched: false,
        };
      });
      setEpisodesData(allEpisodes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowLibrary = () => {
    if (!inLibrary) {
      const showData = {
        showId: showInfo.id,
        name: showInfo.name,
        image: showInfo?.image?.original,
        updated: showInfo.updated
      };
      api
        .addShow({ showData, episodesData, userId: token.getId() })
        .then((res) => {
          dispatch(addLibrary(res.data.showLibrary));
        });
    } else {
      api.deleteShow(mongoId, mongoEpisodeIds, token.getId()).then((res) => {
        dispatch(addLibrary(res.data.showLibrary));
      });
    }
    setInLibrary(!inLibrary);
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
