import { useEffect, useState } from "react";
import { useToken } from "../context/TokenProvider";
import { useSearchTerm } from "../context/SearchContext";

export default function Artists() {
  const { token } = useToken();
  const [artists, setArtists] = useState([]);

  const { setSelectedPlaylist, setCategoriesSelected } = useSearchTerm();
  useEffect(() => {
    async function fetchData() {
      console.log(token);
      const res = await fetch(
        "https://api.spotify.com/v1/me/following?type=artist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log("Data in Artists", data);
      setArtists(data.artists.items);
    }
    fetchData();
  }, []);
  async function getArtistsPlaylist(artistData) {
    console.log("Inside getArtistPlaylist", artistData.id);
    const res = await fetch(
      `https://api.spotify.com/v1/artists/${artistData.id}/top-tracks?market=IN`,

      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const resData = await res.json();
    const normalized = resData.tracks.map((track) => ({ track }));
    console.log("Artist Data", normalized);
    setSelectedPlaylist({
      name: artistData.name,
      description: "Artist Playlist",
      id: artistData.id,
      images: artistData.images,
      items: normalized,
    });
    setCategoriesSelected(true);
  }
  return (
    <>
      <div className="container text-white mt-4">
        <h4
          style={{
            padding: "8px",
            paddingLeft: "20px",
            paddingBottom: "15px  ",
          }}
        >
          Following Artists
        </h4>
        <div
          className="horizontal-scroll d-flex overflow-auto"
          style={{ paddingLeft: "20px" }}
        >
          {artists &&
            artists.map((artist) => (
              <div
                key={artist.id}
                className="me-3 musiccard rounded p-3"
                style={{ minWidth: "150px", maxWidth: "150px" }}
              >
                <div className="album-wrapper">
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="img-fluid artist-image mb-2 album-cover"
                  />
                  <button
                    className="play-button"
                    onClick={() => getArtistsPlaylist(artist)}
                  >
                    <i className="bi bi-play-fill"></i>
                  </button>
                </div>

                <div>
                  <h6 className="mb-0 text-truncate">{artist.name}</h6>
                  <small className="text-white text-truncate d-block"></small>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
