import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Container from "react-bootstrap/Container";
import axios from "axios";
import api from "../utils/api";
import token from "../utils/token";
import { addLibrary } from "../store/slices/showLibrary";
import LibrarySection from "../components/LibrarySection";

const Library = () => {
  const dispatch = useDispatch();
  const showLibrary = useSelector((state) => state.showLibrary);
  const [upToDate, setUpToDate] = useState([]);
  const [hasNewEpisodes, setHasNewEpisodes] = useState([]);
  const [notStarted, setNotStarted] = useState([]);
  const [needsUpdating, setNeedsUpdating] = useState([]);

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
          watched: false,
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
            userId: token.getId(),
          })
          .then((res) => {
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
      {showLibrary.length == 0 && (
        <p>You don't currently have any shows in your library</p>
      )}
      <LibrarySection
        sectionTitle={"Watch Next"}
        allShows={hasNewEpisodes}
      />
      <LibrarySection
        sectionTitle={"Haven't Started Watching"}
        allShows={notStarted}
      />
      <LibrarySection
        sectionTitle={"Up To Date"}
        allShows={upToDate}
      />
    </Container>
  );
};

export default Library;
