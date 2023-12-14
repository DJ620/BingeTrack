import { useState } from "react";
import axios from "axios";
import Show from "../components/Show";
import Container from "react-bootstrap/esm/Container";
import Spinner from "react-bootstrap/esm/Spinner";
import Button from "react-bootstrap/esm/Button";

function Search() {
  const [shows, setShows] = useState([]);
  const [searchShow, setSearchShow] = useState("");
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    setLoading(true);
    event.preventDefault();
    setSearchName(searchShow);
    try {
      const options = {
        method: "GET",
        url: `https://api.tvmaze.com/search/shows?q=${searchShow}`,
      };
      const response = await axios.request(options);
      setShows(response.data);
      setSearchShow("");
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <>
        <p>Search for a TV show:</p>
        <form onSubmit={handleSearch}>
        <span>
          <input
            type="text"
            id="searchTerm"
            name="searchTerm"
            value={searchShow}
            onChange={(e) => setSearchShow(e.target.value)}
          />
          <Button
            variant="primary"
            className="mb-1"
            style={{ marginLeft: "10px" }}
            type="submit"
          >
            Search
          </Button>
          {searchName ? <p className='text-secondary'>Results for "{searchName}"</p> : ''}
          </span>
        </form>
      </>
      {loading ? (
        <Spinner animation="border" role="status" />
      ) : (
        <div>
          {shows.map((tvShow, index) => {
            return (
              <div key={index}>
                <Show tvShow={tvShow} />
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
}

export default Search;
