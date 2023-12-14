import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

const Library = () => {
  const navigate = useNavigate();
  const showLibrary = useSelector((state) => state.showLibrary);
  const [upToDate, setUpToDate] = useState([]);
  const [hasNewEpisodes, setHasNewEpisodes] = useState([]);
  const [notStarted, setNotStarted] = useState([]);

  useEffect(() => {
    setUpToDate(showLibrary.filter(show => show.episodes.filter(ep => !ep.watched && new Date().toISOString() > ep.airTime).length == 0));
    setNotStarted(showLibrary.filter(show => show.episodes.filter(ep => ep.watched).length == 0));
    setHasNewEpisodes(showLibrary.filter(show => show.episodes.filter(ep => !ep.watched && new Date().toISOString() > ep.airTime).length > 0 && show.episodes.filter(ep => ep.watched).length > 0));
  }, [showLibrary]);

  return (
    <Container>
        <h1>Library</h1>
          {showLibrary.length == 0 ? (<p>You don't currently have any shows in your library</p>) : null}
          {hasNewEpisodes.length > 0 ? (
            <h4 className="text-center mt-4">Watch Next</h4>
          ) : null}
          {hasNewEpisodes.length > 0 ? (<Row className="justify-content-center bg-body-secondary pt-3">
          {hasNewEpisodes.map((show) => {
             return  <Col key={show.showId} className="col-lg-3 col-12 col-sm-6 col-md-4 mt-2 text-center">
                <img src={show.image} style={{ maxHeight: '200px', cursor: 'pointer'}} onClick={() => navigate(`/show/${show.showId}`)}/>
                <h4>{show.name}</h4>
              </Col>
            })}
            </Row>) : null}
            {notStarted.length > 0 ? (
            <h4 className="text-center mt-4">Haven't Started Watching</h4>
          ) : null}
         {notStarted.length > 0 ? (<Row className="justify-content-center bg-body-secondary pt-3">
          {notStarted.map((show) => {
             return  <Col key={show.showId} className="col-lg-3 col-12 col-sm-6 col-md-4 mt-2 text-center">
                <img src={show.image} style={{ maxHeight: '200px', cursor: 'pointer'}} onClick={() => navigate(`/show/${show.showId}`)}/>
                <h4>{show.name}</h4>
              </Col>
            })}
            </Row>) : null}
            {upToDate.length > 0 ? (
            <h4 className="text-center mt-4">Up To Date</h4>
          ) : null}
          {upToDate.length > 0 ? (<Row className="justify-content-center bg-body-secondary pt-3">
          {upToDate.map((show) => {
             return  <Col key={show.showId} className="col-lg-3 col-12 col-sm-6 col-md-4 mt-2 text-center">
                <img src={show.image} style={{ maxHeight: '200px', cursor: 'pointer'}} onClick={() => navigate(`/show/${show.showId}`)}/>
                <h4>{show.name}</h4>
              </Col>
            })}
            </Row>) : null}
        </Container>
  )
}

export default Library;